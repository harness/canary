import { useState } from 'react'

import { Badge, Button, DropdownMenu, Icon, Input } from '@/components'

import { FilterOptionConfig } from './types'

interface FilterTriggerProps<FilterKey extends string> {
  options: FilterOptionConfig<FilterKey>[]
  displayLabel?: React.ReactNode | string
  dropdownAlign?: 'start' | 'end'
  inputPlaceholder?: string
  buttonLabel?: string
  onChange: (option: FilterOptionConfig<FilterKey>) => void
  onReset?: () => void
}

const FilterSelect = <FilterKey extends string>({
  displayLabel,
  dropdownAlign = 'end',
  onChange,
  onReset,
  options,
  inputPlaceholder,
  buttonLabel
}: FilterTriggerProps<FilterKey>) => {
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
        <div className="flex items-center border-b border-cn-borders-4 px-3 py-2.5">
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
          <div className="border-t border-cn-borders-4 p-1">
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
      <span className="flex items-center gap-x-1 text-14 text-cn-foreground-2 hover:text-cn-foreground-1">
        {displayLabel}
        {selectedFilters > 0 && (
          // TODO: Design system: Update badge info variant once it is available
          <Badge variant="surface" size="sm">
            {selectedFilters}
          </Badge>
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
