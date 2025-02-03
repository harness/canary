import { useState } from 'react'

import { Icon, Input } from '@/components'
import { DropdownMenu } from '@components/dropdown-menu'

import { FilterOptionConfig } from './types'

interface FilterTriggerProps<T extends object> {
  options: FilterOptionConfig[]
  displayLabel?: React.ReactNode | string
  dropdownAlign?: 'start' | 'end'
  inputPlaceholder?: string
  buttonLabel?: string
  onChange: (option: FilterOptionConfig) => void
  onReset?: () => void
}

const FilterSelect = <T extends object>({
  displayLabel,
  dropdownAlign = 'end',
  onChange,
  onReset,
  options,
  inputPlaceholder,
  buttonLabel
}: FilterTriggerProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBySearchOptions = options.filter(
    option => !searchQuery || option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5">{displayLabel}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[224px] p-0" align={dropdownAlign}>
        <div className="border-borders-4 relative flex items-center justify-between border-b px-3 py-2.5">
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.stopPropagation()}
            onClick={e => e.preventDefault()}
          />

          {searchQuery && (
            <div className="absolute right-3">
              <button
                className="text-foreground-4 hover:text-foreground-1 flex p-1.5 transition-colors duration-200"
                onClick={e => {
                  e.preventDefault()
                  setSearchQuery('')
                }}
              >
                <Icon className="rotate-45" name="plus" size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="p-1">
          {filteredBySearchOptions.map(option => (
            <DropdownMenu.Item key={option.value as string} onSelect={() => onChange(option)}>
              {option.label}
            </DropdownMenu.Item>
          ))}

          {filteredBySearchOptions.length === 0 && (
            <div className="flex items-center justify-center p-4">
              <span className="text-14 text-foreground-2 leading-none">No results</span>
            </div>
          )}
        </div>

        {onReset && (
          <div className="border-borders-4 border-t p-1">
            <DropdownMenu.Item asChild>
              <button className="w-full font-medium" onClick={onReset}>
                {buttonLabel}
              </button>
            </DropdownMenu.Item>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterSelect

FilterSelect.displayName = 'FilterSelect'

const FilterSelectLabel = ({
  selectedFilters,
  displayLabel
}: {
  selectedFilters: number
  displayLabel: React.ReactNode
}) => {
  return (
    <>
      <span className="text-14 text-foreground-2 hover:text-foreground-1 flex items-center gap-x-1">
        {displayLabel}
        {selectedFilters > 0 && (
          <span className="border-tag-border-blue-1 bg-tag-background-blue-1 text-11 text-tag-foreground-blue-1 flex h-[18px] min-w-[17px] items-center justify-center rounded border px-1">
            {selectedFilters}
          </span>
        )}
      </span>
      <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
    </>
  )
}

const FilterSelectAddIconLabel = ({ displayLabel }: { displayLabel: React.ReactNode }) => {
  return (
    <div className="text-foreground-4 hover:text-foreground-1 flex items-center gap-x-1.5 transition-colors duration-200">
      <Icon name="plus" size={10} />
      <span>{displayLabel}</span>
    </div>
  )
}

export { FilterSelectLabel, FilterSelectAddIconLabel }
