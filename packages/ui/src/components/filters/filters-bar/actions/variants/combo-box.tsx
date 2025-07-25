import { ReactNode } from 'react'

import { DropdownMenu, ScrollArea, SearchInput } from '@components/index'

export interface ComboBoxOptions {
  label: string
  value: string
}

interface ComboBoxProps {
  options: Array<ComboBoxOptions>
  onSearch?: (searchQuery: string) => void
  onUpdateFilter: (selectedValues?: ComboBoxOptions) => void
  filterValue?: ComboBoxOptions
  isLoading?: boolean
  placeholder?: string
  noResultsMessage: ReactNode
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

  const renderContent = () => {
    if (isLoading) {
      return <DropdownMenu.Spinner />
    }

    if (options.length === 0) {
      return <DropdownMenu.NoOptions>{noResultsMessage}</DropdownMenu.NoOptions>
    }

    return (
      <ScrollArea className="max-h-64">
        {options.map(option => {
          const { label, value } = option
          return (
            <DropdownMenu.Item
              key={value}
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
      <DropdownMenu.Header>
        {allowSearch ? (
          <SearchInput
            inputContainerClassName="mb-0.5"
            placeholder={placeholder}
            autoFocus
            onKeyDown={e => e.stopPropagation()}
            onChange={value => onSearch?.(value)}
          />
        ) : null}
      </DropdownMenu.Header>
      {renderContent()}
    </>
  )
}
