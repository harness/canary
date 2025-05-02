import { useState } from 'react'

import { Button, DropdownMenu, Icon, Input } from '@/components'

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
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5">{displayLabel}</DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="min-w-[224px] p-0"
        align={dropdownAlign}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <div className="border-cn-borders-4 flex items-center border-b px-3 py-2.5">
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
                variant="ghost"
                iconOnly
                onClick={() => {
                  setSearchQuery('')
                }}
              >
                <Icon className="rotate-45" name="plus" size={12} />
              </Button>
            }
          />
        </div>

        <div className="p-1">
          {filteredBySearchOptions.map(option => (
            <DropdownMenu.Item key={option.value as string} onSelect={() => onChange(option)}>
              {option.label}
            </DropdownMenu.Item>
          ))}

          {filteredBySearchOptions.length === 0 && (
            <div className="flex items-center justify-center p-4">
              <span className="text-2 leading-none text-cn-foreground-2">No results</span>
            </div>
          )}
        </div>

        {customFooter && (
          <div className="border-cn-borders-4 border-t p-1">
            <DropdownMenu.Item asChild>{customFooter}</DropdownMenu.Item>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default SearchableDropdown
