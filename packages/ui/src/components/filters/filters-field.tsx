import { useMemo, useState } from 'react'

import { Checkbox } from '@components/checkbox'
import { Label } from '@components/form-primitives'
import { MultiSelectOption } from '@components/multi-select'
import { cn } from '@utils/cn'

import FilterBoxWrapper from './filter-box-wrapper'
import Calendar from './filters-bar/actions/variants/calendar-field'
import { MultiSelectFilter } from './filters-bar/actions/variants/checkbox'
import Combobox, { ComboBoxOptions } from './filters-bar/actions/variants/combo-box'
import MultiTagFilter from './filters-bar/actions/variants/multi-tag'
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
  dropdownContentClassName?: string
  shouldOpenFilter: boolean
  onOpenChange?: (open: boolean) => void
  onChange: (selectedValues: V) => void
  value?: V
}

interface FilterFieldProps<T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>> {
  filter: FilterField<V>
  filterOption: FilterOptionConfig<T, CustomValue>
  onUpdateFilter: (selectedValues: V) => void
  setIsOpen: (open: boolean) => void
}

const FilterFieldInternal = <T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>>({
  filter,
  filterOption,
  onUpdateFilter,
  setIsOpen
}: FilterFieldProps<T, V, CustomValue>): JSX.Element | null => {
  const uniqId = useMemo(() => `filter-${Math.random().toString(36).slice(2, 11)}`, [])

  if (!onUpdateFilter) return null

  switch (filterOption.type) {
    case FilterFieldTypes.Calendar: {
      const calendarFilter = filter as FilterField<Date>
      return (
        <Calendar
          filter={calendarFilter}
          onUpdateFilter={values => {
            onUpdateFilter(values as V)
            // Currently this supports only single selection, will be handled based on calendar type
            values && setIsOpen(false)
          }}
        />
      )
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
          onUpdateFilter={values => {
            onUpdateFilter(values as V)
          }}
        />
      )
    }
    case FilterFieldTypes.MultiSelect: {
      const checkboxFilter = filter as FilterField<CheckboxOptions[]>
      return (
        <MultiSelectFilter
          {...filterOption.filterFieldConfig}
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
        <Label
          className="rounded-cn-3 bg-cn-gray-secondary border-cn-gray-outline cursor-pointer border px-cn-md py-cn-xs [&>.cn-label-text]:flex [&>.cn-label-text]:items-center [&>.cn-label-text]:gap-x-cn-2xs"
          htmlFor={checkboxId}
        >
          <Checkbox
            id={checkboxId}
            checked={checkboxFilter.value}
            onCheckedChange={value => onUpdateFilter(value as V)}
            className="relative z-[1]"
          />
          {filterOption.filterFieldConfig?.label}
        </Label>
      )
    }

    case FilterFieldTypes.MultiTag: {
      const multiTagFilter = filter as FilterField<MultiSelectOption[]>
      return (
        <MultiTagFilter
          filter={multiTagFilter.value || []}
          onUpdateFilter={values => onUpdateFilter(values as V)}
          filterFieldConfig={filterOption.filterFieldConfig}
        />
      )
    }
    default:
      return null
  }
}

export const FiltersField = <T extends string, V extends FilterValueTypes, CustomValue = Record<string, unknown>>({
  filterOption,
  removeFilter,
  shouldOpenFilter,
  dropdownContentClassName,
  onOpenChange,
  onChange,
  value
}: FiltersFieldProps<T, V, CustomValue>) => {
  const activeFilterOption = {
    type: filterOption.value,
    value
  }
  const [isOpen, setIsOpen] = useState(shouldOpenFilter)

  const onFilterValueChange = (selectedValues: V) => {
    onChange(selectedValues)
  }

  if (filterOption.type === FilterFieldTypes.Checkbox) {
    return (
      <FilterFieldInternal<T, V, CustomValue>
        filter={activeFilterOption}
        filterOption={filterOption}
        onUpdateFilter={onFilterValueChange}
        setIsOpen={setIsOpen}
      />
    )
  }

  return (
    <FilterBoxWrapper
      contentClassName={cn(
        filterOption.type === FilterFieldTypes.Calendar ? 'w-[250px]' : '',
        dropdownContentClassName
      )}
      handleRemoveFilter={() => removeFilter()}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onOpenChange={onOpenChange}
      defaultOpen={shouldOpenFilter}
      filterLabel={filterOption.label}
      valueLabel={getFilterLabelValue(filterOption, activeFilterOption)}
    >
      <FilterFieldInternal<T, V, CustomValue>
        filter={activeFilterOption}
        filterOption={filterOption}
        setIsOpen={setIsOpen}
        onUpdateFilter={onFilterValueChange}
      />
    </FilterBoxWrapper>
  )
}

export default FiltersField
