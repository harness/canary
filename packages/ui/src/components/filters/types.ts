import { ComboBoxOptions } from '@components/filters/filters-bar/actions/variants/combo-box'

import { Parser } from '@harnessio/filters'

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

interface SavedView {
  id: string
  name: string
  filters: FilterValue[]
  sorts: SortValue[]
}

interface ViewLayoutOption {
  label: string
  value: string
}

interface ValidationResult {
  isValid: boolean
  error?: string
}

interface ViewManagement {
  // Validation methods
  validateViewName: (name: string, currentName?: string) => ValidationResult
  hasViewErrors: (views: SavedView[]) => boolean
  hasViewListChanges: (currentViews: SavedView[], originalViews: SavedView[]) => boolean
  hasActiveViewChanges: (activeFilters: FilterValue[], activeSorts: SortValue[]) => boolean
  getExistingNames: (views: SavedView[]) => Set<string>
  checkNameExists: (name: string, excludeId?: string) => boolean
  validateViewNameChange: (
    newName: string,
    currentName: string,
    existingNames: Set<string>
  ) => {
    hasError: boolean
    errorMessage?: string
  }

  // Data preparation
  prepareViewsForSave: (views: SavedView[]) => SavedView[]

  // State management
  savedViews: SavedView[]
  currentView: SavedView | null
  setCurrentView: (view: SavedView | null) => void

  // CRUD operations
  saveView: (name: string, filters: FilterValue[], sorts: SortValue[]) => void
  updateView: (view: SavedView) => void
  deleteView: (viewId: string) => void
  renameView: (viewId: string, newName: string) => void
  applyView: (view: SavedView) => void
  updateViewsOrder: (newViews: SavedView[]) => void
}

interface FilterHandlers {
  // State values
  activeFilters: FilterValue[]
  activeSorts: SortValue[]
  setActiveFilters: (filters: FilterValue[]) => void
  setActiveSorts: (sorts: SortValue[]) => void
  searchQueries: FilterSearchQueries
  filterToOpen: FilterAction | null

  // Filter methods
  handleFilterChange: (newFilter: Omit<FilterValue, 'condition' | 'selectedValues'>, defaultCondition?: string) => void
  handleUpdateFilter: (type: string, selectedValues: string[]) => void
  handleUpdateCondition: (type: string, condition: string) => void
  handleRemoveFilter: (type: string) => void
  handleResetFilters: () => void

  // Sort methods
  handleSortChange: (newSort: SortValue) => void
  handleUpdateSort: (index: number, updatedSort: SortValue) => void
  handleRemoveSort: (index: number) => void
  handleReorderSorts: (newSorts: SortValue[]) => void
  handleResetSorts: () => void

  // Common methods
  handleResetAll: () => void

  // Search methods
  handleSearchChange: (type: string, query: string, searchType: keyof FilterSearchQueries) => void
  clearSearchQuery: (type: string, searchType: keyof FilterSearchQueries) => void

  // Filter opening control
  clearFilterToOpen: () => void
}

export enum FilterFieldTypes {
  Calendar = 'calendar',
  Text = 'text',
  Number = 'number',
  ComboBox = 'combobox',
  Checkbox = 'checkbox'
}

export interface CheckboxOptions {
  label: string
  value: string
}

interface FilterField<T = string | number> {
  type: string
  value?: T
}

interface FilterOptionConfigBase<Key extends string, V = undefined> {
  label: string
  // filter-key with which the filter is identified
  value: Key
  parser?: Parser<V>
}

interface ComboBoxFilterOptionConfig<Key extends string> extends FilterOptionConfigBase<Key, ComboBoxOptions> {
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

interface NumberFilterOptionConfig<T extends string = string> extends FilterOptionConfigBase<T> {
  type: FilterFieldTypes.Number
}

interface CheckboxFilterOptionConfig<T extends string = string>
  extends FilterOptionConfigBase<T, Array<CheckboxOptions>> {
  type: FilterFieldTypes.Checkbox
  filterFieldConfig?: {
    options?: Array<CheckboxOptions>
  }
}

type FilterOptionConfig<T extends string = string> =
  | ComboBoxFilterOptionConfig<T>
  | CalendarFilterOptionConfig<T>
  | TextFilterOptionConfig<T>
  | NumberFilterOptionConfig<T>
  | CheckboxFilterOptionConfig<T>
type FilterValueTypes = string | number | unknown

export type {
  FilterField,
  FilterValueTypes,
  FilterOptionConfig,
  FilterAction,
  FilterOption,
  CalendarFilterOption,
  CheckboxFilterOption,
  FilterCondition,
  FilterValue,
  SortOption,
  SortDirection,
  SortValue,
  FilterSearchQueries,
  SavedView,
  ViewLayoutOption,
  ValidationResult,
  ViewManagement,
  FilterHandlers
}
