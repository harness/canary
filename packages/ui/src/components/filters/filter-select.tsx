import { useState } from 'react'

import { Button, CounterBadge, DropdownMenu, IconV2, Input } from '@/components'

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
      <DropdownMenu.Content align={dropdownAlign} onCloseAutoFocus={e => e.preventDefault()}>
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
                size="xs"
                iconOnly
                onClick={() => {
                  setSearchQuery('')
                }}
                ignoreIconOnlyTooltip
              >
                <IconV2 name="xmark" size="2xs" />
              </Button>
            }
          />
        </DropdownMenu.Header>

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

export default FilterSelect

FilterSelect.displayName = 'FilterSelect'

const renderFilterSelectLabel = ({
  selectedFilters,
  displayLabel
}: {
  selectedFilters: number
  displayLabel: React.ReactNode
}) => {
  return (
    <Button size="sm" variant="transparent">
      {displayLabel}
      {selectedFilters > 0 && <CounterBadge>{selectedFilters}</CounterBadge>}
      <IconV2 name="nav-solid-arrow-down" size="2xs" />
    </Button>
  )
}

const renderFilterSelectAddIconLabel = ({ displayLabel }: { displayLabel: React.ReactNode }) => {
  return (
    <Button variant="transparent">
      <IconV2 name="plus" />
      <span>{displayLabel}</span>
    </Button>
  )
}

export { renderFilterSelectLabel, renderFilterSelectAddIconLabel }
