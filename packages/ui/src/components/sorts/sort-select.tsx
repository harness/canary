import { Button, IconV2 } from '@/components'
import SearchableDropdown from '@components/searchable-dropdown/searchable-dropdown'

import { useSort } from './sort-context'
import { Direction, SortOption } from './type'

export interface SortTriggerProps {
  displayLabel?: React.ReactNode | string
  buttonLabel?: string
}

const SortSelect = ({ displayLabel, buttonLabel }: SortTriggerProps) => {
  const { sortOptions, sortSelections, updateSortSelections, setSortOpen } = useSort()
  const filteredSortOptions = sortOptions.filter(option => !sortSelections.some(sort => sort.type === option.value))

  const onSelectChange = (option: SortOption) => {
    updateSortSelections([...sortSelections, { type: option.value, direction: Direction.ASC }])
    setSortOpen(true)
  }

  return (
    <SearchableDropdown<SortOption>
      displayLabel={
        <Button size="sm" variant="transparent">
          {displayLabel}
          <IconV2 name="solid-arrow-down" size="2xs" />
        </Button>
      }
      inputPlaceholder="Select..."
      options={filteredSortOptions}
      onChange={onSelectChange}
      buttonLabel={buttonLabel}
      onReset={() => updateSortSelections([])}
    />
  )
}

export default SortSelect
