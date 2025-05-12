import { ReactNode } from 'react'

import { Button, ControlGroup, DropdownMenu, Icon, Input, Label, ScrollArea, SearchBox } from '@/components'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { TFunction } from 'i18next'

export type MultiSelectOptionTypeV2 = {
  key: string
  value?: string
  disabled?: boolean
  onReset?: () => void
}

export interface MultiSelectV2Props {
  className?: string
  selectedItems: MultiSelectOptionTypeV2[]
  t: TFunction
  placeholder: string
  handleChange: (data: MultiSelectOptionTypeV2) => void
  options?: MultiSelectOptionTypeV2[]
  searchValue?: string
  handleChangeSearchValue?: (data: string) => void
  customOptionElem?: (data: MultiSelectOptionTypeV2) => ReactNode
  error?: string
  label?: string
}

export const MultiSelectV2 = ({
  className,
  selectedItems,
  t,
  placeholder,
  handleChange,
  options = [],
  searchValue = '',
  handleChangeSearchValue,
  customOptionElem,
  error,
  label
}: MultiSelectV2Props) => {
  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue,
    searchValue
  })

  const hasOptions = options.length > 0

  return (
    <ControlGroup className={className}>
      {!!label && (
        <Label className="mb-2" htmlFor={''}>
          {label}
        </Label>
      )}

      {hasOptions ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="w-full">
              <Input className="w-full" placeholder={placeholder} />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="z-50" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
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
                  const isSelected = selectedItems.findIndex(it => it.key === option.key) > -1

                  return (
                    <DropdownMenu.Item
                      key={option.key}
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
                          <span className="font-medium">{option.key}</span>
                        )}
                      </div>
                    </DropdownMenu.Item>
                  )
                })}
              </ScrollArea>
            ) : (
              <div className="px-5 py-4 text-center">
                <span className="leading-tight text-cn-foreground-2">
                  {t('views:noData.noResults', 'No search results')}
                </span>
              </div>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        <Input className="w-full" placeholder={placeholder} />
      )}

      {!!selectedItems.length && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedItems.map(it => (
            <Button key={it.key} size="sm" type="button" variant="outline" onClick={() => handleChange(it)}>
              {it.key}
              <Icon name="close" size={10} />
            </Button>
          ))}
        </div>
      )}
    </ControlGroup>
  )
}
