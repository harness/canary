import { useState } from 'react'

import { Button, DropdownMenu, IconV2, Input } from '@/components'

interface SearchableDropdownProps<T> {
  options: T[]
  displayLabel?: React.ReactNode | string
  dropdownAlign?: 'start' | 'end'
  inputPlaceholder?: string
  onChange: (option: T) => void
  customFooter?: React.ReactNode
}

const SearchableDropdown = <T extends { label: string; value: string }>({
  displayLabel,
  dropdownAlign = 'end',
  onChange,
  customFooter,
  options,
  inputPlaceholder
}: SearchableDropdownProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBySearchOptions = options.filter(
    option => !searchQuery || option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{displayLabel}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[224px]" align={dropdownAlign} onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Header>
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={searchQuery}
            variant="extended"
            // This is stop focus shift by dropdown,
            // It will try to focus on first dropdown menu item on keychange
            onKeyDown={e => e.stopPropagation()}
            onChange={e => setSearchQuery(e.target.value)}
            rightElement={
              <Button
                variant="transparent"
                size="sm"
                iconOnly
                onClick={() => {
                  setSearchQuery('')
                }}
              >
                <IconV2 className="rotate-45" name="plus" size="2xs" />
              </Button>
            }
          />
        </DropdownMenu.Header>

        {filteredBySearchOptions.map(option => (
          <DropdownMenu.Item key={option.value as string} onSelect={() => onChange(option)} title={option.label} />
        ))}

        {filteredBySearchOptions.length === 0 && <DropdownMenu.NoOptions>No results</DropdownMenu.NoOptions>}

        {customFooter && <DropdownMenu.Footer>{customFooter}</DropdownMenu.Footer>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default SearchableDropdown
