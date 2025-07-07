import { useCallback, useRef, useState } from 'react'

import { DropdownMenu, SearchInput } from '@/components'
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

  const handleOnSearchChange = useCallback(
    (searchQuery: string) => {
      setFilteredItems(filterItems(navbarMenuData, searchQuery))
    },
    [navbarMenuData]
  )

  const handleItemClick = (item: NavbarItemType) => {
    addToPinnedItems(item)
    setFilteredItems(filterItems(navbarMenuData, ''))
    setSearchDialogOpen(false)
  }

  const handleInputFocus = () => {
    if (inputRef.current?.value === '') {
      setFilteredItems(navbarMenuData)
    }
  }

  const countFilteredItems =
    filteredItems.length + filteredItems.reduce((acc, category) => acc + category.items.length, 0)

  return (
    <DropdownMenu.Root open={isSearchDialogOpen} onOpenChange={setSearchDialogOpen}>
      <DropdownMenu.Trigger className="w-full">
        <SearchInput
          className="w-full"
          id="manage-navigation-search"
          ref={inputRef}
          placeholder="Add menu element"
          onFocus={handleInputFocus}
          onChange={handleOnSearchChange}
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
