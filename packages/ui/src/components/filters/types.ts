type FilterActionKind = 'filter' | 'sort'

interface FilterAction {
  type: string
  kind: FilterActionKind
}

interface FilterOptionBase {
  label: string
  value: string
  type: string
  conditions?: FilterCondition[]
}

type FilterOption = CalendarFilterOption | CheckboxFilterOption | TextFilterOption | NumberFilterOption

interface CalendarFilterOption extends FilterOptionBase {
  type: 'calendar'
}

interface CheckboxFilterOption extends FilterOptionBase {
  type: 'checkbox'
  options: Array<{
    label: string
    value: string
  }>
}

interface TextFilterOption extends FilterOptionBase {
  type: 'text'
}

interface NumberFilterOption extends FilterOptionBase {
  type: 'number'
}

interface FilterCondition {
  label: string
  value: string
}

interface FilterValue {
  type: string
  condition: string
  selectedValues: string[]
}

interface SortOption {
  label: string
  value: string
}

interface SortDirection {
  label: string
  value: string
}

interface SortValue {
  type: string
  direction: string
}

interface FilterSearchQueries {
  filters: Record<string, string>
  menu: Record<string, string>
}

export type {
  FilterAction,
  FilterOption,
  CalendarFilterOption,
  CheckboxFilterOption,
  FilterCondition,
  FilterValue,
  SortOption,
  SortDirection,
  SortValue,
  FilterSearchQueries
}
