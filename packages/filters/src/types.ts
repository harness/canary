export interface FilterType<T = any> {
  value: T
  query: string | null
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
