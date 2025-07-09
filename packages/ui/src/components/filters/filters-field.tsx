import { useMemo } from 'react'

import { Button } from '@components/button'
import { Checkbox } from '@components/checkbox'
import { Label } from '@components/form-primitives'

import FilterBoxWrapper from './filter-box-wrapper'
import Calendar from './filters-bar/actions/variants/calendar-field'
import { MultiSelectFilter } from './filters-bar/actions/variants/checkbox'
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
  valueLabel?: string
  shouldOpenFilter: boolean
  onOpenChange?: (open: boolean) => void
  onChange: (selectedValues: V) => void
  value?: V
}

interface FilterFieldProps<T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>> {
  filter: FilterField<V>
  filterOption: FilterOptionConfig<T, CustomValue>
  onUpdateFilter: (selectedValues: V) => void
}

const FilterFieldInternal = <T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>>({
  filter,
  filterOption,
  onUpdateFilter
}: FilterFieldProps<T, V, CustomValue>): JSX.Element | null => {
  const uniqId = useMemo(() => `filter-${Math.random().toString(36).slice(2, 11)}`, [])

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
        <MultiSelectFilter
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
      const checkboxId = `checkbox-${uniqId}`
      return (
        // TODO Need to remove button once we get the designs for checkbox filter
        <Button variant="secondary" theme="default" className="gap-x-2.5">
          <Checkbox
            id={checkboxId}
            checked={checkboxFilter.value}
            onCheckedChange={value => onUpdateFilter(value as V)}
          />
          <Label className="grid-cols-none" htmlFor={checkboxId}>
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
    return (
      <FilterFieldInternal<T, V, CustomValue>
        filter={activeFilterOption}
        filterOption={filterOption}
        onUpdateFilter={onFilterValueChange}
      />
    )
  }

  return (
    <FilterBoxWrapper
      contentClassName={filterOption.type === FilterFieldTypes.Calendar ? 'w-[250px]' : ''}
      handleRemoveFilter={() => removeFilter()}
      onOpenChange={onOpenChange}
      defaultOpen={shouldOpenFilter}
      filterLabel={filterOption.label}
      valueLabel={getFilterLabelValue(filterOption, activeFilterOption)}
    >
      <FilterFieldInternal<T, V, CustomValue>
        filter={activeFilterOption}
        filterOption={filterOption}
        onUpdateFilter={onFilterValueChange}
      />
    </FilterBoxWrapper>
  )
}

export default FiltersField
