export interface SortOption {
  label: string
  value: string
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface SortDirection {
  label: string
  value: Direction
}

export interface SortValue {
  type: string
  direction: Direction
}
