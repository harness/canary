import { useState } from 'react'

import { DropdownMenu, SearchInput } from '@/components'

interface SearchableDropdownProps<T> {
  options: T[]
  displayLabel?: React.ReactNode | string
  dropdownAlign?: 'start' | 'end'
  inputPlaceholder?: string
  onChange: (option: T) => void
  onReset?: () => void
  buttonLabel?: string
  isSearchable?: boolean
}

export const SearchableDropdown = <T extends { label: string; value: string }>({
  displayLabel,
  dropdownAlign = 'end',
  onChange,
  onReset,
  isSearchable = false,
  options,
  inputPlaceholder,
  buttonLabel
}: SearchableDropdownProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBySearchOptions = options.filter(
    option => !searchQuery || option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{displayLabel}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[224px]" align={dropdownAlign} onCloseAutoFocus={e => e.preventDefault()}>
        {isSearchable && (
          <DropdownMenu.Header>
            <SearchInput placeholder={inputPlaceholder} value={searchQuery} onChange={value => setSearchQuery(value)} />
          </DropdownMenu.Header>
        )}

        {filteredBySearchOptions.map(option => (
          <DropdownMenu.Item key={option.value as string} onSelect={() => onChange(option)} title={option.label} />
        ))}

        {filteredBySearchOptions.length === 0 && <DropdownMenu.NoOptions>No results</DropdownMenu.NoOptions>}

        {onReset && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item title={buttonLabel} onClick={onReset} />
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
