import { Icon } from '@/components'
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
        <>
          <span className="flex items-center gap-x-1 text-cn-foreground-2 hover:text-cn-foreground-1">
            {displayLabel}
          </span>
          <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
        </>
      }
      inputPlaceholder="Select..."
      options={filteredSortOptions}
      onChange={onSelectChange}
      customFooter={
        <button className="w-full font-medium" onClick={() => updateSortSelections([])}>
          {buttonLabel}
        </button>
      }
    />
  )
}

export default SortSelect
