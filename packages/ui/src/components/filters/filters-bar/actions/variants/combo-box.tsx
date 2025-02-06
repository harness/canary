import { ReactNode } from 'react'

import { Command } from '@components/command'
import { Icon } from '@components/icon'

interface ComboBoxProps {
  options: Array<{ label: string; value: string }>
  onSearch?: (searchQuery: string) => void
  onUpdateFilter: (selectedValues: string) => void
  filterValue: string
  placeholder?: string
  noResultsMessage: ReactNode
}

export default function ComboBox({
  options,
  onSearch,
  onUpdateFilter,
  filterValue,
  placeholder,
  noResultsMessage
}: ComboBoxProps) {
  return (
    <Command.Root shouldFilter={false}>
      <Command.Input
        placeholder={placeholder}
        className="h-9"
        autoFocus
        onInput={e => onSearch?.((e.target as HTMLInputElement).value)}
      />
      <Command.List>
        {options.length === 0 && <Command.Empty>{noResultsMessage}</Command.Empty>}
        {options.map(option => {
          const { label, value } = option
          return (
            <Command.Item
              className="flex h-9"
              key={value}
              value={value}
              onSelect={currentValue => {
                onUpdateFilter(currentValue === filterValue ? '' : currentValue)
              }}
            >
              <div className="mx-2 flex size-4 items-center">
                {value === filterValue && <Icon name="tick" size={12} className="text-foreground-8" />}
              </div>
              {label}
            </Command.Item>
          )
        })}
      </Command.List>
    </Command.Root>
  )
}
