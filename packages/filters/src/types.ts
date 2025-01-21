export interface FilterType<T = any> {
  value?: T
  query?: string
  state: FilterStatus
}

export interface FilterConfig<T = any> {
  parser?: Parser<T>
  isSticky?: boolean
}

export type InitializeFiltersConfigType = { state: FilterStatus } & FilterConfig
export interface FilterTypeWithComponent<T = any> extends FilterType<T> {
  component: React.ReactElement
}

export interface FilterQueryParamsType {}

export type Parser<T> = {
  parse: (value: string) => T
  serialize: (value: T) => string
}

export enum FilterStatus {
  VISIBLE = 'VISIBLE',
  FILTER_APPLIED = 'FILTER_APPLIED',
  HIDDEN = 'HIDDEN'
}

export interface FilterRefType<T> {
  getValues: () => T
  reset: () => void
  visibleFilters: (keyof T)[]
  removeFilter: (filter: keyof T) => void
}
