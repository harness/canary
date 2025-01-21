import { Parser } from "@harnessio/filters"

type FilterActionKind = 'filter' | 'sort'

interface FilterAction {
  type: string
  kind: FilterActionKind
}

interface FilterOptionBase<T extends object> {
  label: string
  value: keyof T
  type: string
}

type FilterOption<T extends object> = CalendarFilterOption<T> | CheckboxFilterOption<T> | TextFilterOption<T> | NumberFilterOption<T>

interface CalendarFilterOption<T extends object = object> extends FilterOptionBase<T> {
  type: 'calendar'
}

interface CheckboxFilterOption<T extends object = object> extends FilterOptionBase<T> {
  type: 'checkbox'
  options: Array<{
    label: string
    value: string
  }>
  parser: Parser<any>
}

interface TextFilterOption<T extends object = object> extends FilterOptionBase<T> {
  type: 'text'
}

interface NumberFilterOption<T extends object = object> extends FilterOptionBase<T> {
  type: 'number'
}

interface FilterCondition {
  label: string
  value: string
}

interface FilterValue<T extends object = any> {
  type: keyof T
  condition: string
  selectedValues: T[keyof T] | undefined
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
  FilterSearchQueries,
  SavedView,
  ViewLayoutOption,
  ValidationResult,
  ViewManagement,
  FilterHandlers
}
