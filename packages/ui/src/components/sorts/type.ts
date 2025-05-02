export interface SortOption {
  label: string
  value: string
}

type Direction = 'asc' | 'desc'

export interface SortDirection {
  label: string
  value: Direction
}

export interface SortValue {
  type: string
  direction: Direction
}
