import { ReactNode } from 'react'

import type { MultiSelectOption } from '@components/multi-select'
import { format } from 'date-fns'

import { configuredPresetLabel, formatDateRangeV2Label } from '../date-range-v2/format-date-range-v2-label'
import { resolveTimeZone } from '../date-range-v2/resolve-date-range-v2'
import { resolveDateRangeV2Config } from '../date-range-v2/resolve-picker-config'
import { formatTimeZoneOffset } from '../date-range-v2/timezone-utils'
import type { DateRangeV2Config, DateRangeV2FilterValue } from '../date-range-v2/types'
import { ComboBoxOptions } from './filters-bar/actions/variants/combo-box'
import {
  CheckboxOptions,
  DateRangeValue,
  FilterFieldConfig,
  FilterFieldTypes,
  FilterOptionConfig,
  FilterValueTypes
} from './types'

export const getDateRangeV2FilterLabel = (
  value: DateRangeV2FilterValue | undefined,
  config?: DateRangeV2Config
): string => {
  if (!value) return ''
  try {
    const resolved = resolveDateRangeV2Config(config)
    const bounds = value.from && value.to ? ([value.from.getTime(), value.to.getTime()] as const) : undefined
    const presetTitle =
      value.range.kind === 'preset' ? configuredPresetLabel(value.range.preset, resolved.presets) : undefined
    const labelRange =
      value.range.kind === 'preset'
        ? ({
            kind: 'fixed',
            from: { date: '1970-01-01', time: '00:00' },
            to: { date: '1970-01-01', time: '23:59' }
          } as const)
        : value.range
    const label = formatDateRangeV2Label(
      labelRange,
      value.timezone,
      new Date(),
      resolved.triggerLabel,
      bounds,
      presetTitle
    )
    const offset = resolved.triggerLabel.showTimezone
      ? ` · ${formatTimeZoneOffset(resolveTimeZone(value.timezone))}`
      : ''
    return `${label.triggerText}${offset}`
  } catch {
    return ''
  }
}

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
    case FilterFieldTypes.DateRange: {
      const filterValue = filter.value as DateRangeValue | undefined
      if (!filterValue) return ''

      const currentYear = new Date().getFullYear()
      const fromDate = new Date(filterValue.from)
      const toDate = new Date(filterValue.to)
      const sameYear = fromDate.getFullYear() === toDate.getFullYear() && fromDate.getFullYear() === currentYear

      if (sameYear) {
        return `${format(fromDate, 'MMM d')} - ${format(toDate, 'MMM d')}`
      }

      if (fromDate.getFullYear() === toDate.getFullYear()) {
        return `${format(fromDate, 'MMM d')} - ${format(toDate, 'MMM d, yyyy')}`
      }

      return `${format(fromDate, 'MMM d, yyyy')} - ${format(toDate, 'MMM d, yyyy')}`
    }
    case FilterFieldTypes.DateRangeV2: {
      const filterValue = filter.value as DateRangeV2FilterValue | undefined
      return getDateRangeV2FilterLabel(filterValue, filterOption.filterFieldConfig)
    }
    case FilterFieldTypes.ComboBox: {
      const filterValue = filter.value as ComboBoxOptions | undefined
      if (filterValue?.label) {
        return filterValue.label
      }

      const options = filterOption.filterFieldConfig?.options
      return options?.find(option => option.value === filterValue?.value)?.label
    }
    case FilterFieldTypes.MultiSelect: {
      const options = filterOption.filterFieldConfig?.options
      return (filter.value as CheckboxOptions[])
        ?.map(
          selectedOption =>
            options?.find(option => option.value === selectedOption.value)?.label || selectedOption.value
        )
        .join(', ')
    }
    case FilterFieldTypes.MultiTag: {
      return (filter.value as MultiSelectOption[])
        ?.map(option => String(option.id || (option.value ? `${option.key}:${option.value}` : option.key)))
        .filter(Boolean)
        .join(', ')
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

export const getMultiSelectParser = (options: CheckboxOptions[]) => {
  return {
    parse: (value: string) => {
      // Since "," can be encoded while appending to URL
      const valueArr = decodeURIComponent(value)
        .split(',')
        .filter(Boolean)
        .map(val => options.find(option => option.value === val))
        .filter((option): option is CheckboxOptions => option !== undefined)
      return valueArr
    },
    serialize: (value?: CheckboxOptions[]) => value?.reduce((acc, val) => (acc += `${val.value},`), '') || ''
  }
}
