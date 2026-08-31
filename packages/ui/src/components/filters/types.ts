import { JSX, ReactNode } from 'react'
import { ClassNames, DayPickerRangeProps } from 'react-day-picker'

import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'
import { MultiSelectOption, MultiSelectProps } from '@components/multi-select'

import type {
  DateRangeInput,
  DateRangePickerCalendarProps,
  InterpretDateRangeQuery,
  DateRangePreset as SemanticDateRangePreset,
  DateRangeValue as SemanticDateRangeValue,
  TimeZoneId,
  Weekday
} from '../date-range-picker'

export type DateRangeCalendarProps = Omit<
  DayPickerRangeProps,
  'mode' | 'numberOfMonths' | 'selected' | 'onSelect' | 'month' | 'onMonthChange' | 'classNames'
>

export type Parser<T> = {
  parse: (value: string) => T
  serialize: (value: T) => string
}

export enum FilterFieldTypes {
  Calendar = 'calendar',
  DateRange = 'daterange',
  Text = 'text',
  ComboBox = 'combobox',
  Custom = 'custom',
  MultiSelect = 'multiselect',
  Checkbox = 'checkbox',
  MultiTag = 'multitag'
}

/** @deprecated Use DateRangeInput or SemanticDateRangeValue for new integrations. */
export type DateRangeValue = DateRangeInput

/** @deprecated Use SemanticDateRangePreset for new integrations. */
export interface DateRangePreset {
  label: string
  value: string
  getRange: () => { from: Date; to: Date }
  group: 'recommended' | 'relative' | 'calendar'
}

export type DateRangeFilterPreset = DateRangePreset | SemanticDateRangePreset

export type SecretListFilters = {
  secretTypes?: CheckboxOptions[]
  secretManagerIdentifiers?: CheckboxOptions[]
  description?: string
  tags?: string
}

export interface CheckboxOptions {
  label: string
  value: string
  disabled?: boolean
}

interface FilterFieldConfig<T = string | number> {
  type: string
  value?: T
}

interface FilterOptionConfigBase<Key extends string, V = undefined> {
  label: string
  // filter-key with which the filter is identified
  value: Key
  parser?: Parser<V>
  defaultValue?: V
  isDefaultValue?: boolean
  sticky?: boolean
  group?: string
}

interface ComboBoxFilterOptionConfig<Key extends string = string> extends FilterOptionConfigBase<Key, ComboBoxOptions> {
  type: FilterFieldTypes.ComboBox
  filterFieldConfig: {
    options: Array<{ label: string | React.ReactNode; value: string }>
    onSearch?: (query: string) => void
    noResultsMessage?: string
    loadingMessage?: string
    placeholder: string
    isLoading?: boolean
    /**
     * Searching is enabled by default, but can be disabled if the options are few and do not require searching.
     */
    allowSearch?: boolean
  }
}

interface CalendarFilterOptionConfig<T extends string = string> extends FilterOptionConfigBase<T, Date> {
  type: FilterFieldTypes.Calendar
}

interface TextFilterOptionConfig<T extends string = string> extends FilterOptionConfigBase<T> {
  type: FilterFieldTypes.Text
}
export interface CustomFilterOptionConfig<T extends string = string, V = Record<string, unknown>>
  extends FilterOptionConfigBase<T, V> {
  type: FilterFieldTypes.Custom
  filterFieldConfig: {
    renderCustomComponent: ({ value, onChange }: { value?: V; onChange: (value: V) => void }) => JSX.Element | null
    renderFilterLabel?: (value?: V) => ReactNode
  }
}

interface MultiSelectFilterOptionConfig<T extends string = string>
  extends FilterOptionConfigBase<T, Array<CheckboxOptions>> {
  type: FilterFieldTypes.MultiSelect
  filterFieldConfig?: {
    options?: Array<CheckboxOptions>
    onSearch?: (query: string) => void
    noResultsMessage?: string
    loadingMessage?: string
    placeholder?: string
    isLoading?: boolean
    allowSearch?: boolean
  }
}

interface MultiTagFilterOptionConfig<T extends string = string>
  extends FilterOptionConfigBase<T, Array<MultiSelectOption>> {
  type: FilterFieldTypes.MultiTag
  filterFieldConfig?: MultiSelectProps
}

interface CheckboxFilterOptionConfig<T extends string = string> extends FilterOptionConfigBase<T, boolean> {
  type: FilterFieldTypes.Checkbox
  filterFieldConfig?: {
    label: ReactNode
  }
}

interface DateRangeFilterOptionConfig<T extends string = string> extends FilterOptionConfigBase<T, DateRangeValue> {
  type: FilterFieldTypes.DateRange
  filterFieldConfig?: {
    presets?: DateRangeFilterPreset[]
    showCustomRange?: boolean
    calendarProps?: DateRangeCalendarProps | DateRangePickerCalendarProps
    calendarClassNames?: ClassNames
    allowFuture?: boolean
    enableTimeSelection?: boolean
    enableOffset?: boolean
    enableExclusions?: boolean
    onInterpretQuery?: InterpretDateRangeQuery
    weekStartsOn?: Weekday
    defaultTimeZone?: TimeZoneId
  }
}

type FilterOptionConfig<T extends string = string, V = Record<string, unknown>> =
  | ComboBoxFilterOptionConfig<T>
  | CalendarFilterOptionConfig<T>
  | DateRangeFilterOptionConfig<T>
  | TextFilterOptionConfig<T>
  | CheckboxFilterOptionConfig<T>
  | MultiSelectFilterOptionConfig<T>
  | MultiTagFilterOptionConfig<T>
  | CustomFilterOptionConfig<T, V>

type FilterValueTypes = string | number | unknown

export type {
  FilterFieldConfig,
  FilterValueTypes,
  FilterOptionConfig,
  ComboBoxFilterOptionConfig,
  MultiSelectFilterOptionConfig,
  CheckboxFilterOptionConfig,
  TextFilterOptionConfig,
  CalendarFilterOptionConfig,
  DateRangeFilterOptionConfig
}

export type { SemanticDateRangePreset, SemanticDateRangeValue }
