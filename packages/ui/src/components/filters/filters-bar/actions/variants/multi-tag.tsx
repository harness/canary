import { MultiSelect, MultiSelectOption, MultiSelectProps } from '@components/multi-select'
import { cn } from '@utils/cn'

export interface MultiTagFilterProps {
  filter: MultiSelectOption[]
  onUpdateFilter: (values: MultiSelectOption[]) => void
  filterFieldConfig?: MultiSelectProps
}

export const MultiTagFilter = ({ filter, onUpdateFilter, filterFieldConfig }: MultiTagFilterProps): JSX.Element => {
  const { wrapperClassName, options, ...multiSelectProps } = filterFieldConfig ?? {}

  return (
    <MultiSelect
      placeholder="Filter a tag"
      creationLabel="Press Enter to filter"
      {...multiSelectProps}
      value={filter}
      onChange={onUpdateFilter}
      // Free-form tags: empty options shows the creation hint; reserve space for absolute dropdown.
      options={options ?? []}
      wrapperClassName={cn('pb-cn-3xl', wrapperClassName)}
    />
  )
}

export default MultiTagFilter
