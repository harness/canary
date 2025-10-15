import { ReactNode } from 'react'

import { DropdownMenu, ScrollArea, SearchInput, useSearchableDropdownKeyboardNavigation } from '@components/index'

export interface ComboBoxOptions {
  label: string | ReactNode
  value: string
}

interface ComboBoxProps {
  options: Array<ComboBoxOptions>
  onSearch?: (searchQuery: string) => void
  onUpdateFilter: (selectedValues?: ComboBoxOptions) => void
  filterValue?: ComboBoxOptions
  isLoading?: boolean
  placeholder?: string
  noResultsMessage?: ReactNode
  allowSearch?: boolean
}

export default function ComboBox({
  options = [],
  onSearch,
  onUpdateFilter,
  filterValue,
  placeholder,
  isLoading,
  noResultsMessage,
  allowSearch = true
}: ComboBoxProps) {
  const selectedFilterValue = filterValue?.value

  const { searchInputRef, handleSearchKeyDown, getItemProps } = useSearchableDropdownKeyboardNavigation({
    itemsLength: options.length
  })

  const renderContent = () => {
    if (isLoading) {
      return <DropdownMenu.Spinner />
    }

    if (options.length === 0) {
      return <DropdownMenu.NoOptions>{noResultsMessage}</DropdownMenu.NoOptions>
    }

    return (
      <ScrollArea className="max-h-64">
        {options.map((option, index) => {
          const { label, value } = option
          const { ref, onKeyDown } = getItemProps(index)

          return (
            <DropdownMenu.Item
              key={value}
              ref={ref}
              onKeyDown={onKeyDown}
              onSelect={() => onUpdateFilter(value === selectedFilterValue ? undefined : option)}
              checkmark={value === selectedFilterValue}
              title={label}
            />
          )
        })}
      </ScrollArea>
    )
  }

  return (
    <>
      {allowSearch && (
        <DropdownMenu.Header>
          <SearchInput
            ref={searchInputRef}
            inputContainerClassName="mb-cn-4xs"
            placeholder={placeholder}
            autoFocus
            onKeyDown={e => {
              e.stopPropagation()
              handleSearchKeyDown(e)
            }}
            onChange={value => onSearch?.(value)}
          />
        </DropdownMenu.Header>
      )}
      {renderContent()}
    </>
  )
}
