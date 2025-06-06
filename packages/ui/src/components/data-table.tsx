import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, TableOptions, useReactTable } from '@tanstack/react-table'

import { Pagination, PaginationProps } from './pagination/pagination'
import { TableV2 } from './table-v2'

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  size?: 'default' | 'relaxed' | 'compact'
  pagination?: PaginationProps
  enableSorting?: boolean
  defaultSorting?: SortingState
}

export function DataTable<TData>({
  data = [],
  columns,
  size = 'default',
  pagination,
  enableSorting = false,
  defaultSorting = []
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)

  const tableOptions: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  }
  
  // Add sorting state if enabled
  if (enableSorting) {
    tableOptions.onSortingChange = setSorting
    tableOptions.state = {
      ...tableOptions.state,
      sorting
    }
  }

  const table = useReactTable(tableOptions)

  return (
    <div>
      <TableV2.Root variant={size}>
        <TableV2.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <TableV2.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableV2.Head 
                  key={header.id}
                  className={header.column.getCanSort() ? 'cursor-pointer select-none' : undefined}
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                >
                  <div className="flex items-center gap-1">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="ml-1">
                        {{
                          asc: String.fromCharCode(8593), // Up arrow
                          desc: String.fromCharCode(8595) // Down arrow
                        }[header.column.getIsSorted() as string] ?? String.fromCharCode(8645)} {/* Up-down arrow */}
                      </span>
                    )}
                  </div>
                </TableV2.Head>
              ))}
            </TableV2.Row>
          ))}
        </TableV2.Header>
        <TableV2.Body>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableV2.Row key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableV2.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableV2.Cell>
                ))}
              </TableV2.Row>
            ))
          ) : (
            <TableV2.Row>
              <TableV2.Cell colSpan={columns.length} className="py-6 text-center">
                {'No results found.'}
              </TableV2.Cell>
            </TableV2.Row>
          )}
        </TableV2.Body>
      </TableV2.Root>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          pageSize={pagination.pageSize || 10} // Provide default value to avoid undefined
          totalItems={pagination.totalItems || 0}
          goToPage={pagination?.goToPage || (() => {})}
          indeterminate={false}
        />
      )}
    </div>
  )
}
