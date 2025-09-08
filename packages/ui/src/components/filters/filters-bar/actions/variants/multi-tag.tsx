import { MultiSelect, MultiSelectOption, MultiSelectProps } from '@components/multi-select'

export interface MultiTagFilterProps {
  filter: MultiSelectOption[]
  onUpdateFilter: (values: MultiSelectOption[]) => void
  filterFieldConfig?: MultiSelectProps
}

export const MultiTagFilter = ({ filter, onUpdateFilter, filterFieldConfig }: MultiTagFilterProps): JSX.Element => {
  return <MultiSelect value={filter} onChange={onUpdateFilter} {...filterFieldConfig} />
}

export default MultiTagFilter
