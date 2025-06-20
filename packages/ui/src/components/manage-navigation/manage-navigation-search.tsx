import { useRef, useState } from 'react'

import { DropdownMenu, SearchBox } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { MenuGroupType, NavbarItemType } from '@components/app-sidebar/types'

const filterItems = (categories: MenuGroupType[], query: string): MenuGroupType[] => {
  if (!query.trim()) return categories

  return categories.reduce<MenuGroupType[]>((acc, category) => {
    const filteredItems = category.items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    if (filteredItems.length > 0) {
      acc.push({
        ...category,
        items: filteredItems
      })
    }
    return acc
  }, [])
}

interface ManageNavigationSearchProps {
  navbarMenuData: MenuGroupType[]
  addToPinnedItems: (item: NavbarItemType) => void
}

export const ManageNavigationSearch = ({ navbarMenuData, addToPinnedItems }: ManageNavigationSearchProps) => {
  const [filteredItems, setFilteredItems] = useState<MenuGroupType[]>(navbarMenuData)
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    search: searchQuery,
    handleSearchChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setFilteredItems(filterItems(navbarMenuData, val))
  })

  const handleItemClick = (item: NavbarItemType) => {
    addToPinnedItems(item)
    handleResetSearch()
    setSearchDialogOpen(false)
  }

  const handleInputFocus = () => {
    if (searchQuery === '') {
      setFilteredItems(navbarMenuData)
    }
  }

  const countFilteredItems =
    filteredItems.length + filteredItems.reduce((acc, category) => acc + category.items.length, 0)

  return (
    <DropdownMenu.Root open={isSearchDialogOpen} onOpenChange={setSearchDialogOpen}>
      <DropdownMenu.Trigger>
        <SearchBox.Root
          className="w-full"
          inputClassName="h-9 placeholder:text-cn-foreground-3"
          ref={inputRef}
          placeholder="Add menu element"
          value={searchQuery}
          handleChange={handleSearchChange}
          hasSearchIcon={false}
          onFocus={handleInputFocus}
          onClick={() => setSearchDialogOpen(true)}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-[--radix-dropdown-menu-trigger-width] max-w-none">
        {countFilteredItems === 0 && <DropdownMenu.NoOptions>No results found</DropdownMenu.NoOptions>}

        {filteredItems.map((category, index) => (
          <DropdownMenu.Group key={`category-${category.groupId}-${index}`} label={category.title}>
            {category.items.map(item => (
              <DropdownMenu.Item key={`item-${item.id}`} title={item.title} onSelect={() => handleItemClick(item)} />
            ))}
          </DropdownMenu.Group>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
