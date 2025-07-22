import { ReactNode } from 'react'

import { Command } from '@components/command'
import { IconV2 } from '@components/icon-v2'
import { SearchInput } from '@components/index'
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
}

export default function ComboBox({
  options = [],
  onSearch,
  onUpdateFilter,
  filterValue,
  placeholder,
  isLoading,
  noResultsMessage
}: ComboBoxProps) {
  const selectedFilterValue = filterValue?.value
  const debouncedSearch = onSearch ? debounce(onSearch, 400) : undefined

  const renderContent = () => {
    if (isLoading) {
      return (
        <Command.Loading className="px-2 py-4 text-sm text-cn-foreground-3">
          <div className="flex place-content-center space-x-2">
            <IconV2 className="animate-spin" name="loader" />
          </div>
        </Command.Loading>
      )
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
          <div className="mx-2.5 flex size-4 items-center">
            {value === selectedFilterValue && <IconV2 name="check" />}
          </div>
          {label}
        </Command.Item>
      )
    })
  }

  return (
    <Command.Root shouldFilter={false}>
      <SearchInput
        inputContainerClassName="mx-2 mt-2 mb-2.5 w-auto"
        placeholder={placeholder}
        autoFocus
        onChange={value => debouncedSearch?.(value)}
      />
      <Command.List>{renderContent()}</Command.List>
    </Command.Root>
  )
}
