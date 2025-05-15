import { Button } from '@components/button'
import { Checkbox } from '@components/checkbox'
import { Label } from '@components/form-primitives'
import { TFunction } from 'i18next'

import FilterBoxWrapper from './filter-box-wrapper'
import Calendar from './filters-bar/actions/variants/calendar-field'
import { default as MulltiSelect } from './filters-bar/actions/variants/checkbox'
import Combobox, { ComboBoxOptions } from './filters-bar/actions/variants/combo-box'
import Text from './filters-bar/actions/variants/text-field'
import {
  CheckboxOptions,
  FilterFieldConfig as FilterField,
  FilterFieldTypes,
  FilterOptionConfig,
  FilterValueTypes
} from './types'
import { getFilterLabelValue } from './utils'

export interface FiltersFieldProps<
  T extends string,
  V extends FilterValueTypes,
  CustomValue = Record<string, unknown>
> {
  filterOption: FilterOptionConfig<T, CustomValue>
  removeFilter: () => void
  t: TFunction
  valueLabel?: string
  shouldOpenFilter: boolean
  onOpenChange?: (open: boolean) => void
  onChange: (selectedValues: V) => void
  value?: V
}

const renderFilterValues = <T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>>(
  filter: FilterField<V>,
  filterOption: FilterOptionConfig<T, CustomValue>,
  onUpdateFilter: (selectedValues: V) => void
): JSX.Element | null => {
  if (!onUpdateFilter) return null

  switch (filterOption.type) {
    case FilterFieldTypes.Calendar: {
      const calendarFilter = filter as FilterField<Date>
      return <Calendar filter={calendarFilter} onUpdateFilter={values => onUpdateFilter(values as V)} />
    }
    case FilterFieldTypes.Text: {
      const textFilter = filter as FilterField<string>
      return <Text filter={textFilter} onUpdateFilter={values => onUpdateFilter(values as V)} />
    }
    case FilterFieldTypes.ComboBox: {
      const comboBoxFilter = filter as FilterField<ComboBoxOptions>
      return (
        <Combobox
          filterValue={comboBoxFilter.value}
          {...filterOption.filterFieldConfig}
          onUpdateFilter={values => onUpdateFilter(values as V)}
        />
      )
    }
    case FilterFieldTypes.MultiSelect: {
      const checkboxFilter = filter as FilterField<CheckboxOptions[]>
      return (
        <MulltiSelect
          filter={checkboxFilter.value || []}
          filterOption={filterOption.filterFieldConfig?.options || []}
          onUpdateFilter={values => onUpdateFilter(values as V)}
        />
      )
    }
    case FilterFieldTypes.Custom: {
      const customFilter = filter as unknown as FilterField<CustomValue>
      return filterOption.filterFieldConfig.renderCustomComponent({
        value: customFilter.value,
        onChange: (values: unknown) => onUpdateFilter(values as V)
      })
    }
    case FilterFieldTypes.Checkbox: {
      const checkboxFilter = filter as FilterField<boolean>
      return (
        <Button variant="secondary" theme="default" className="cursor-pointer" asChild>
          <Label className="gap-x-3">
            <Checkbox
              className="pb-1"
              checked={checkboxFilter.value}
              onCheckedChange={value => onUpdateFilter(value as V)}
            />
            <span>{filterOption.filterFieldConfig?.label}</span>
          </Label>
        </Button>
      )
    }
    default:
      return null
  }
}

const FiltersField = <T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>>({
  filterOption,
  removeFilter,
  shouldOpenFilter,
  onOpenChange,
  t,
  onChange,
  value
}: FiltersFieldProps<T, V, CustomValue>) => {
  const activeFilterOption = {
    type: filterOption.value,
    value
  }

  const onFilterValueChange = (selectedValues: V) => {
    onChange(selectedValues)
  }

  if (filterOption.type === FilterFieldTypes.Checkbox) {
    return renderFilterValues<T, V, CustomValue>(activeFilterOption, filterOption, onFilterValueChange) ?? null
  }

  return (
    <FilterBoxWrapper
      contentClassName={filterOption.type === FilterFieldTypes.Calendar ? 'w-[250px]' : ''}
      handleRemoveFilter={() => removeFilter()}
      t={t}
      onOpenChange={onOpenChange}
      defaultOpen={shouldOpenFilter}
      filterLabel={filterOption.label}
      valueLabel={getFilterLabelValue(filterOption, activeFilterOption)}
    >
      {renderFilterValues<T, V, CustomValue>(activeFilterOption, filterOption, onFilterValueChange) ?? null}
    </FilterBoxWrapper>
  )
}

export default FiltersField
