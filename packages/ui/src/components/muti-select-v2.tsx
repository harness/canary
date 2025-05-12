import { KeyboardEvent, ReactNode, useRef, useState } from 'react'

import { Button, ControlGroup, DropdownMenu, Icon, Label, ScrollArea } from '@/components'
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
  const { handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue,
    searchValue
  })
  
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  const hasOptions = options.length > 0
  
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newItem: MultiSelectOptionTypeV2 = { key: inputValue.trim() }
      handleChange(newItem)
      setInputValue('')
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (handleChangeSearchValue) {
      handleSearchChange(e)
    }
  }
  
  const renderSelectedItemsInInput = () => {
    return (
      <div className="flex flex-wrap items-center gap-1 p-1">
        {selectedItems.map(it => (
          <Button 
            key={it.key} 
            size="sm" 
            type="button" 
            variant="outline" 
            className="h-6 py-0 px-2"
            onClick={(e) => {
              e.stopPropagation()
              handleChange(it)
            }}
          >
            {it.key}
            <Icon name="close" size={10} className="ml-1" />
          </Button>
        ))}
        <input
          ref={inputRef}
          className="min-w-[80px] flex-1 border-none outline-none p-1 bg-transparent"
          placeholder={selectedItems.length ? '' : placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    )
  }

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
            <div className="w-full rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
              {renderSelectedItemsInInput()}
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="z-50" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
            {!!handleChangeSearchValue && (
              <>
                <DropdownMenu.Separator />
              </>
            )}
            {options.length ? (
              <ScrollArea className="max-h-[300px]">
                {options.map(option => {
                  const isSelected = selectedItems.findIndex(it => it.key === option.key) > -1

                  return (
                    <DropdownMenu.Item
                      key={option.key}
                      className={cn('px-3', { 'pl-8': !isSelected })}
                      onSelect={e => {
                        e.preventDefault()
                        handleChange(option)
                        setInputValue('')
                      }}
                    >
                      <div className="flex items-center gap-x-2">
                        {isSelected && <Icon className="text-icons-2 min-w-3" name="tick" size={12} />}
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
              <div className="py-4 px-5 text-center">
                <span className="text-cn-foreground-2 leading-tight">
                  {t('views:noData.noResults', 'No search results')}
                </span>
              </div>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        <div className="w-full rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
          {renderSelectedItemsInInput()}
        </div>
      )}
      {!!error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </ControlGroup>
  )
}
