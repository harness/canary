import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  ScrollArea,
  SearchBox
} from '@/components'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'
import { debounce } from 'lodash-es'

export type MultiSelectOptionType<T = unknown> = T & {
  id: string | number
  label: string
}

export interface MultiSelectProps<T = unknown> {
  selectedItems: MultiSelectOptionType<Partial<T>>[]
  t: TFunction
  placeholder: string
  handleChange: (data: MultiSelectOptionType<Partial<T>>) => void
  options: MultiSelectOptionType<T>[]
  searchValue?: string
  handleChangeSearchValue?: (data: string) => void
  customOptionElem?: (data: MultiSelectOptionType<T>) => ReactNode
}

export const MultiSelect = <T = unknown,>({
  selectedItems,
  t,
  placeholder,
  handleChange,
  options,
  searchValue = '',
  handleChangeSearchValue,
  customOptionElem
}: MultiSelectProps<T>) => {
  const [search, setSearch] = useState('')

  const debouncedChangeSearchRef = useRef(debounce((value: string) => handleChangeSearchValue?.(value), 300))

  useEffect(() => setSearch(searchValue ?? ''), [searchValue])

  useEffect(() => {
    const debouncedChangeSearch = debouncedChangeSearchRef.current

    return () => {
      debouncedChangeSearch.cancel()
    }
  }, [])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedChangeSearchRef.current(value)
  }

  const selectedValues = useMemo(() => {
    const selectedUsersLength = selectedItems.length

    if (!selectedUsersLength) {
      return <span className="text-foreground-2">{placeholder}</span>
    }

    if (selectedItems.length > 2) {
      const quantity = selectedUsersLength - 2

      return (
        <span>
          {`${selectedItems[0].label}, ${selectedItems[1].label}, `}
          {t('component:andQuantityMore', {
            defaultValue: `and ${quantity} more`,
            quantity
          })}
        </span>
      )
    }

    return (
      <div className="-ml-1.5 flex gap-2.5">
        {selectedItems.map(it => (
          <div key={it.id} className="flex h-6 items-center gap-x-3 rounded bg-background-8 px-2.5">
            <span className="font-medium text-foreground-8">{it.label}</span>
            <button
              className="pointer-events-auto text-icons-1 transition-colors duration-200 hover:text-foreground-1"
              onClick={() => handleChange(it)}
            >
              <Icon className="rotate-45" name="plus" size={10} />
            </button>
          </div>
        ))}
      </div>
    )
  }, [handleChange, placeholder, selectedItems, t])

  return (
    <DropdownMenu>
      <div className="relative">
        <DropdownMenuTrigger className="flex h-9 w-full items-center justify-between rounded border border-borders-2 px-3 transition-colors data-[state=open]:border-borders-8">
          <Icon name="chevron-down" className="chevron-down ml-auto" size={12} />
        </DropdownMenuTrigger>
        <div className="pointer-events-none absolute inset-0 flex items-center pl-3 pr-9">{selectedValues}</div>
      </div>

      <DropdownMenuContent
        style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
        onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
      >
        {!!handleChangeSearchValue && (
          <>
            <div className="px-2 py-1.5">
              <SearchBox.Root
                className="w-full"
                placeholder={t('views:repos.search', 'Search')}
                value={search}
                handleChange={handleSearchChange}
                showOnFocus
              />
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {options.length ? (
          <ScrollArea viewportClassName="max-h-[300px]">
            {options.map(option => {
              const isSelected = selectedItems.findIndex(it => it.id === option.id) > -1

              return (
                <DropdownMenuItem
                  key={option.id}
                  className={cn('px-3', { 'pl-8': !isSelected })}
                  onSelect={e => {
                    e.preventDefault()
                    handleChange(option)
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    {isSelected && <Icon className="min-w-3 text-icons-2" name="tick" size={12} />}
                    {customOptionElem ? customOptionElem(option) : <span className="font-medium">{option.label}</span>}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </ScrollArea>
        ) : (
          <div className="px-5 py-4 text-center">
            <span className="leading-tight text-foreground-2">{t('views:noData.noResults', 'No search results')}</span>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
