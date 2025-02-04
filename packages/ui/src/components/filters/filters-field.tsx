import FilterBoxWrapper from './filter-box-wrapper'
import Calendar from './filters-bar/actions/variants/calendar-field'
import Text from './filters-bar/actions/variants/text-field'
import { FilterField, FilterFieldTypes, FilterOptionConfig, FilterValueTypes } from './types'
import { getFilterLabelValue } from './utils'

export interface FiltersFieldProps<T extends FilterValueTypes> {
  filterOption: FilterOptionConfig
  removeFilter: () => void
  shouldOpenFilter: boolean
  onChange: (selectedValues: T) => void
  value?: T
}

const renderFilterValues = <T extends FilterValueTypes>(
  filter: FilterField<T>,
  filterOption: FilterOptionConfig,
  onUpdateFilter: (selectedValues: T) => void
) => {
  if (!onUpdateFilter) return null

  switch (filterOption.type) {
    case 'calendar': {
      const calendarFilter = filter as FilterField<Date>
      return <Calendar filter={calendarFilter} onUpdateFilter={values => onUpdateFilter(values as T)} />
    }
    case 'text': {
      const textFilter = filter as FilterField<string>
      return <Text filter={textFilter} onUpdateFilter={values => onUpdateFilter(values as T)} />
    }
    default:
      return null
  }
}

const FiltersField = <T extends FilterValueTypes>({
  filterOption,
  removeFilter,
  shouldOpenFilter,
  onChange,
  value
}: FiltersFieldProps<T>) => {
  const activeFilterOption = {
    type: filterOption.value,
    value
  }

  const onFilterValueChange = (selectedValues: T) => {
    onChange(selectedValues)
  }

  return (
    <FilterBoxWrapper
      contentClassName={filterOption.type === FilterFieldTypes.Calendar ? 'w-[250px]' : ''}
      handleRemoveFilter={() => removeFilter()}
      shouldOpen={shouldOpenFilter}
      filterLabel={filterOption.label}
      valueLabel={getFilterLabelValue(filterOption, activeFilterOption)}
    >
      {renderFilterValues<T>(activeFilterOption, filterOption, onFilterValueChange)}
    </FilterBoxWrapper>
  )
}

export default FiltersField
