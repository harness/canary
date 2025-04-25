import { ReactNode } from 'react'

import { format } from 'date-fns'

import { ComboBoxOptions } from './filters-bar/actions/variants/combo-box'
import { CheckboxOptions, FilterFieldConfig, FilterFieldTypes, FilterOptionConfig, FilterValueTypes } from './types'

export const getFilterLabelValue = <
  T extends string,
  V extends FilterValueTypes,
  CustomValue = Record<string, unknown>
>(
  filterOption: FilterOptionConfig<T, CustomValue>,
  filter: FilterFieldConfig<V>
): ReactNode => {
  switch (filterOption.type) {
    case FilterFieldTypes.Calendar: {
      const filterValue = filter.value as Date
      if (!filterValue) return ''

      const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        const currentYear = new Date().getFullYear()
        return date.getFullYear() === currentYear ? format(date, 'MMM d') : format(date, 'MMM d, yyyy')
      }

      return formatDate(filterValue)
    }
    case FilterFieldTypes.ComboBox: {
      return (filter.value as ComboBoxOptions)?.label
    }
    case FilterFieldTypes.Checkbox: {
      return (filter.value as CheckboxOptions[])?.map(option => option.label).join(', ')
    }
    case FilterFieldTypes.Text: {
      return filter.value as string
    }
    case FilterFieldTypes.Custom: {
      return filterOption.filterFieldConfig.renderFilterLabel?.(filter.value as CustomValue)
    }
    default:
      return ''
  }
}
