import { useState } from 'react'

import { Button, DropdownMenu, Icon, Input, StatusBadge } from '@/components'

import { FilterOptionConfig } from './types'

interface FilterTriggerProps<FilterKey extends string, CustomValue = Record<string, unknown>> {
  options: FilterOptionConfig<FilterKey, CustomValue>[]
  displayLabel?: React.ReactNode | string
  dropdownAlign?: 'start' | 'end'
  inputPlaceholder?: string
  buttonLabel?: string
  onChange: (option: FilterOptionConfig<FilterKey, CustomValue>) => void
  onReset?: () => void
}

const FilterSelect = <FilterKey extends string, CustomValue = Record<string, unknown>>({
  displayLabel,
  dropdownAlign = 'end',
  onChange,
  onReset,
  options,
  inputPlaceholder,
  buttonLabel
}: FilterTriggerProps<FilterKey, CustomValue>) => {
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

        {onReset && (
          <div className="border-cn-borders-4 border-t p-1">
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
      {/* TODO: Design system: Update with proper button */}
      <span className="text-14 flex items-center gap-x-1 text-cn-foreground-2 hover:text-cn-foreground-1">
        {displayLabel}
        {selectedFilters > 0 && (
          <StatusBadge variant="outline" size="sm">
            {selectedFilters}
          </StatusBadge>
        )}
      </span>
      <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
    </>
  )
}

const FilterSelectAddIconLabel = ({ displayLabel }: { displayLabel: React.ReactNode }) => {
  return (
    <Button size="sm" variant="ghost" className="gap-x-1.5">
      <Icon name="plus" size={10} />
      <span>{displayLabel}</span>
    </Button>
  )
}

export { FilterSelectLabel, FilterSelectAddIconLabel }
