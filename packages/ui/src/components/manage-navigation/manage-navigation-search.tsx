import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger, ScrollArea, SearchBox, Text } from '@/components'
import { MenuGroupType, NavbarItemType } from '@components/navbar/types'
import { cn } from '@utils/cn'
import { debounce } from 'lodash-es'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const debouncedSearch = useRef(debounce((value: string) => setFilteredItems(filterItems(navbarMenuData, value)), 300))

  useEffect(() => {
    const debouncedChangeSearch = debouncedSearch.current

    return () => {
      debouncedChangeSearch.cancel()
    }
  }, [])

  const handleSearchChange = (event: ChangeEvent) => {
    event.preventDefault()
    const query = (event.target as HTMLInputElement).value
    setSearchQuery(query)
    debouncedSearch.current(query)
  }

  const handleItemClick = (item: NavbarItemType) => {
    addToPinnedItems(item)
    setSearchQuery('')
    setSearchDialogOpen(false)
  }

  const handleInputFocus = () => {
    setSearchDialogOpen(true)
    if (searchQuery === '') {
      setFilteredItems(navbarMenuData)
    }
  }

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'tab') {
        const isShift = e.shiftKey
        const activeElement = document.activeElement

        if (!popoverRef.current) return

        const focusableElements = popoverRef.current!.querySelectorAll<HTMLElement>('button:not([disabled])')
        const firstFocusableElement = focusableElements[0]

        if (!isShift && activeElement === inputRef.current) {
          e.preventDefault()

          if (firstFocusableElement) {
            firstFocusableElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleTabKey)

    return () => {
      window.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  const countFilteredItems =
    filteredItems.length + filteredItems.reduce((acc, category) => acc + category.items.length, 0)

  return (
    <Popover open={isSearchDialogOpen} onOpenChange={setSearchDialogOpen}>
      <PopoverTrigger asChild>
        <SearchBox.Root
          className="w-full"
          inputClassName="h-9 placeholder:text-foreground-5"
          ref={inputRef}
          placeholder="Add menu element"
          value={searchQuery}
          handleChange={handleSearchChange}
          hasSearchIcon={false}
          onFocus={handleInputFocus}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-[368px] overflow-hidden !rounded border-borders-1 bg-background-2 !p-0"
        ref={popoverRef}
        align="start"
        onWheel={e => e.stopPropagation()}
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <ScrollArea className={cn('relative max-h-[50vh]', countFilteredItems > 10 && 'h-[404px]')}>
          <div className="px-1 pb-2 pt-1">
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-3 w-full bg-gradient-to-b from-background-2 to-transparent"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-3 w-full bg-gradient-to-t from-background-2 to-transparent"
              aria-hidden
            />
            {countFilteredItems === 0 ? (
              <Text className="block w-full px-2 py-4 text-foreground-5">No results found</Text>
            ) : (
              filteredItems.map((category, index) => (
                <div
                  className={cn(index > 0 ? 'border-borders-4 mt-0.5 border-t pt-2' : 'pt-1')}
                  key={`category-${category.groupId}-${index}`}
                >
                  <Text className="inline-block px-2 leading-none text-foreground-7" size={1}>
                    {category.title}
                  </Text>
                  <div className="mt-2.5 flex flex-col">
                    {category.items.map(item => (
                      <Button
                        className="h-9 cursor-pointer rounded-sm px-2 focus-visible:ring-offset-0"
                        variant="ghost"
                        key={`item-${item.id}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex w-full items-center gap-x-2">
                          <Text className="truncate leading-tight text-foreground-8">{item.title}</Text>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
