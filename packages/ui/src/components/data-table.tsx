import { ReactNode } from 'react'

import { Pagination, PaginationProps } from './pagination/pagination'
import { TableV2 } from './table-v2'

export interface ColumnDef<T> {
  header: string | ReactNode
  accessorKey: keyof T | string
  cell?: (value: unknown, row: T) => ReactNode
}

export interface TableProps<T> {
  data?: T[]
  columns: ColumnDef<T>[]
  variant?: 'default' | 'relaxed' | 'compact'
  pagination?: PaginationProps
}

export function DataTable<T>({ data = [], columns, variant = 'default', pagination }: TableProps<T>) {
  const getValue = (row: T, accessorKey: string | keyof T) => {
    return row[accessorKey as keyof T]
  }

  return (
    <div className="space-y-4">
      <TableV2.Root variant={variant}>
        <TableV2.Header>
          <TableV2.Row>
            {columns.map((column, index) => (
              <TableV2.Head key={index}>{column.header}</TableV2.Head>
            ))}
          </TableV2.Row>
        </TableV2.Header>
        <TableV2.Body hasHighlightOnHover>
          {data.map((row, rowIndex) => (
            <TableV2.Row key={rowIndex}>
              {columns.map((column, colIndex) => {
                const value = getValue(row, column.accessorKey)
                return <TableV2.Cell key={colIndex}>{column.cell ? column.cell(value, row) : value}</TableV2.Cell>
              })}
            </TableV2.Row>
          ))}
        </TableV2.Body>
      </TableV2.Root>

      {pagination && (
        <Pagination
          totalItems={pagination.totalItems ?? 0}
          pageSize={pagination.pageSize ?? 0}
          currentPage={pagination.currentPage ?? 0}
          goToPage={page => {
            if (pagination.goToPage) {
              pagination.goToPage(page)
            }
          }}
        />
      )}
    </div>
  )
}
