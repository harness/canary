import { DataPagination } from './pagination-data'
import { DefaultPagination } from './pagination-default'
import { type ParentPaginationProps } from './types'

export function Pagination({ variant = 'default', ...props }: ParentPaginationProps) {
  switch (variant) {
    case 'default':
      return <DefaultPagination {...props} />
    case 'data':
      return <DataPagination {...props} />
  }
}
