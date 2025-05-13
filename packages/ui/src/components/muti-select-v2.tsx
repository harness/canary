import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'

import { Button, ControlGroup, DropdownMenu, Icon, Input, Label, ScrollArea } from '@/components'
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
  value?: MultiSelectOptionTypeV2[]
  t: TFunction
  placeholder: string
  handleChange: (data: MultiSelectOptionTypeV2) => void
  options?: MultiSelectOptionTypeV2[]
  searchValue?: string
  handleChangeSearchValue?: (data: string) => void
  customOptionElem?: (data: MultiSelectOptionTypeV2) => ReactNode
  error?: string
  label?: string
  disallowCreations?: boolean
}

export const MultiSelectV2 = ({
  className,
  value = [],
  t,
  placeholder,
  handleChange,
  options = [],
  // searchValue is not used anymore
  handleChangeSearchValue,
  customOptionElem,
  error,
  label,
  disallowCreations = false
}: MultiSelectV2Props) => {
  // We don't need to use the search functionality anymore

  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasOptions = options.length > 0

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()

      // Create a new item with the input value
      const newItem: MultiSelectOptionTypeV2 = { key: inputValue.trim() }
      handleChange(newItem)
      setInputValue('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const renderSelectedItemsInInput = () => {
    return (
      <div className="flex flex-wrap items-center gap-1 p-1">
        {value?.map(it => (
          <Button
            key={it.key}
            size="sm"
            type="button"
            variant="outline"
            className="h-6 py-0 px-2"
            onClick={e => {
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
          placeholder={value?.length ? '' : placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onClick={() => setIsDropdownOpen(true)}
          readOnly={disallowCreations}
          autoFocus
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
        <>
          <div className="w-full rounded-md border">{renderSelectedItemsInInput()}</div>

          <DropdownMenu.Root
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            modal={false} // This is important - prevents Radix from managing focus
          >
            {/* Hidden trigger that won't interfere with input focus */}
            <DropdownMenu.Trigger aria-hidden="true" />
            <DropdownMenu.Content className="z-50" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
              {!!handleChangeSearchValue && (
                <>
                  <DropdownMenu.Separator />
                </>
              )}
              {options.length ? (
                <ScrollArea className="max-h-[300px]">
                  {options.map(option => {
                    const isSelected = value?.findIndex(it => it.key === option.key) > -1

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
        </>
      ) : (
        <div className="w-full rounded-md border">{renderSelectedItemsInInput()}</div>
      )}
      {!!error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </ControlGroup>
  )
}
