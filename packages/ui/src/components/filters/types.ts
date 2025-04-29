import { JSX, ReactNode } from 'react'

import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'

import { Parser } from '@harnessio/filters'

export enum FilterFieldTypes {
  Calendar = 'calendar',
  Text = 'text',
  ComboBox = 'combobox',
  Custom = 'custom',
  MultiSelect = 'multiselect',
  Checkbox = 'checkbox'
}

export interface CheckboxOptions {
  label: string
  value: string
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
}

interface ComboBoxFilterOptionConfig<Key extends string = string> extends FilterOptionConfigBase<Key, ComboBoxOptions> {
  type: FilterFieldTypes.ComboBox
  filterFieldConfig: {
    options: Array<{ label: string; value: string }>
    onSearch: (query: string) => void
    noResultsMessage: string
    loadingMessage?: string
    placeholder: string
    isLoading?: boolean
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
  }
}

interface CheckboxFilterOptionConfig<T extends string = string> extends FilterOptionConfigBase<T, boolean> {
  type: FilterFieldTypes.Checkbox
  filterFieldConfig?: {
    label: ReactNode
  }
}

type FilterOptionConfig<T extends string = string, V = Record<string, unknown>> =
  | ComboBoxFilterOptionConfig<T>
  | CalendarFilterOptionConfig<T>
  | TextFilterOptionConfig<T>
  | CheckboxFilterOptionConfig<T>
  | MultiSelectFilterOptionConfig<T>
  | CustomFilterOptionConfig<T, V>
type FilterValueTypes = string | number | unknown

export type {
  FilterFieldConfig,
  FilterValueTypes,
  FilterOptionConfig,
  ComboBoxFilterOptionConfig,
  CheckboxFilterOptionConfig,
  TextFilterOptionConfig,
  CalendarFilterOptionConfig
}
