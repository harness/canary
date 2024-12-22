export interface FilterType<T = any> {
  filterKey: string
  value: T
  query: string | null
  state: FilterStatus
  isSticky?: boolean
  parser?: Parser<T>
}

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
