import { ReactNode } from 'react'

import {
  Button,
  ControlGroup,
  DropdownMenu,
  Icon,
  Label,
  Message,
  MessageTheme,
  ScrollArea,
  SearchBox
} from '@/components'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

export type MultiSelectOptionType<T = unknown> = T & {
  id: string | number
  label: string
}

export interface MultiSelectProps<T = unknown> {
  className?: string
  selectedItems: MultiSelectOptionType<Partial<T>>[]
  t: TFunction
  placeholder: string
  handleChange: (data: MultiSelectOptionType<Partial<T>>) => void
  options: MultiSelectOptionType<T>[]
  searchValue?: string
  handleChangeSearchValue?: (data: string) => void
  customOptionElem?: (data: MultiSelectOptionType<T>) => ReactNode
  error?: string
  label?: string
}

export const MultiSelect = <T = unknown,>({
  className,
  selectedItems,
  t,
  placeholder,
  handleChange,
  options,
  searchValue = '',
  handleChangeSearchValue,
  customOptionElem,
  error,
  label
}: MultiSelectProps<T>) => {
  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue,
    searchValue
  })

  return (
    <ControlGroup className={className}>
      {!!label && (
        <Label className="mb-2.5" color="secondary" htmlFor={''}>
          {label}
        </Label>
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex h-9 w-full items-center justify-between rounded border border-borders-2 bg-input-background px-3 transition-colors data-[state=open]:border-borders-8">
          {placeholder}
          <Icon name="chevron-down" className="chevron-down ml-auto" size={12} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
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
              <DropdownMenu.Separator />
            </>
          )}
          {options.length ? (
            <ScrollArea viewportClassName="max-h-[300px]">
              {options.map(option => {
                const isSelected = selectedItems.findIndex(it => it.id === option.id) > -1

                return (
                  <DropdownMenu.Item
                    key={option.id}
                    className={cn('px-3', { 'pl-8': !isSelected })}
                    onSelect={e => {
                      e.preventDefault()
                      handleChange(option)
                    }}
                  >
                    <div className="flex items-center gap-x-2">
                      {isSelected && <Icon className="min-w-3 text-icons-2" name="tick" size={12} />}
                      {customOptionElem ? (
                        customOptionElem(option)
                      ) : (
                        <span className="font-medium">{option.label}</span>
                      )}
                    </div>
                  </DropdownMenu.Item>
                )
              })}
            </ScrollArea>
          ) : (
            <div className="px-5 py-4 text-center">
              <span className="leading-tight text-foreground-2">
                {t('views:noData.noResults', 'No search results')}
              </span>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {!!selectedItems.length && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedItems.map(it => (
            <Button
              key={it.id}
              className="group flex h-6 items-center gap-x-1.5 bg-background-8 px-2.5 text-foreground-8"
              type="button"
              variant="custom"
              onClick={() => handleChange(it)}
            >
              {it.label}
              <Icon
                className="rotate-45 text-icons-1 transition-colors group-hover:text-foreground-1"
                name="plus"
                size={10}
              />
            </Button>
          ))}
        </div>
      )}

      {!!error && (
        <Message className="mt-0.5" theme={MessageTheme.ERROR}>
          {error}
        </Message>
      )}
    </ControlGroup>
  )
}
