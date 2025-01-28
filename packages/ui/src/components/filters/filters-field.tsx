import FilterBoxWrapper from './filter-box-wrapper'
import Calendar from './filters-bar/actions/variants/calendar'
import Checkbox from './filters-bar/actions/variants/checkbox'
import Number from './filters-bar/actions/variants/number'
import Text from './filters-bar/actions/variants/text'
import { CheckboxFilterOption, FilterOption, FilterValue } from './types'
import { getFilterDisplayValue } from './utils'

interface FiltersFieldProps<T extends FiltersObject> {
  filterOption: FilterOption<T>
  removeFilter: (type: keyof T) => void
  shouldOpenFilter: boolean
  onChange: (selectedValues: T[keyof T]) => void
  value: T[keyof T]
}

interface FiltersObject {
  [key: string]: any
}

const renderFilterValues = <T extends object>(
  filter: FilterValue,
  filterOption: FilterOption<T>,
  onUpdateFilter: (type: keyof T, selectedValues: T[keyof T]) => void,
  filteredOptions?: CheckboxFilterOption['options']
) => {
  if (!onUpdateFilter) return null

  switch (filterOption.type) {
    case 'checkbox':
      return (
        <Checkbox<T>
          filter={filter}
          filterOption={{
            ...filterOption,
            options: filteredOptions || (filterOption as CheckboxFilterOption).options
          }}
          onUpdateFilter={onUpdateFilter}
        />
      )
    case 'calendar':
      return <Calendar<T> filter={filter} onUpdateFilter={onUpdateFilter} />
    case 'text':
      return <Text<T> filter={filter} onUpdateFilter={onUpdateFilter} />
    case 'number':
      return <Number<T> filter={filter} onUpdateFilter={onUpdateFilter} />
    default:
      return null
  }
}

const FiltersField = <T extends FiltersObject>({
  filterOption,
  removeFilter,
  shouldOpenFilter,
  onChange,
  value
}: FiltersFieldProps<T>) => {
  const activeFilterOption = {
    type: filterOption.value,
    selectedValues: value || []
  }

  const onFilterValueChange = (_type: keyof T, selectedValues: T[keyof T]) => {
    onChange(selectedValues)
  }

  return (
    <FilterBoxWrapper<T>
      filterKey={filterOption.value}
      handleRemoveFilter={type => removeFilter(type)}
      shouldOpen={shouldOpenFilter}
      filterLabel={filterOption.label}
      valueLabel={getFilterDisplayValue<T>(filterOption, activeFilterOption)}
    >
      {renderFilterValues(activeFilterOption, filterOption, onFilterValueChange)}
    </FilterBoxWrapper>
  )
}

export default FiltersField
