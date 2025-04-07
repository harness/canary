import { ReactNode } from 'react'

import { Command } from '@components/command'
import { Icon } from '@components/icon'
import { debounce } from 'lodash-es'

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
  loadingMessage?: ReactNode
}

export default function ComboBox({
  options = [],
  onSearch,
  onUpdateFilter,
  filterValue,
  placeholder,
  isLoading,
  loadingMessage,
  noResultsMessage
}: ComboBoxProps) {
  const selectedFilterValue = filterValue?.value
  const debouncedSearch = onSearch ? debounce(onSearch, 400) : undefined

  const renderContent = () => {
    if (isLoading) {
      return <Command.Loading className="px-2 py-4 text-sm text-cn-foreground-3">{loadingMessage}</Command.Loading>
    }

    if (options.length === 0) {
      return <Command.Empty>{noResultsMessage}</Command.Empty>
    }

    return options.map(option => {
      const { label, value } = option
      return (
        <Command.Item
          className="flex h-9"
          key={value}
          value={value}
          onSelect={currentValue => {
            onUpdateFilter(currentValue === selectedFilterValue ? undefined : option)
          }}
        >
          <div className="mx-2 flex size-4 items-center">
            {value === selectedFilterValue && <Icon name="tick" size={12} className="text-cn-foreground-1" />}
          </div>
          {label}
        </Command.Item>
      )
    })
  }

  return (
    <Command.Root shouldFilter={false}>
      <Command.Input
        placeholder={placeholder}
        className="h-9"
        autoFocus
        onInput={e => debouncedSearch?.(e.currentTarget.value)}
      />
      <Command.List>{renderContent()}</Command.List>
    </Command.Root>
  )
}
