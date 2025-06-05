import { useState } from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'

import { Pagination, PaginationProps } from './pagination/pagination'
import { TableV2 } from './table-v2'

export interface TableProps<T> {
  data?: T[]
  columns: ColumnDef<T>[]
  variant?: 'default' | 'relaxed' | 'compact'
  pagination?: PaginationProps
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  pageSize?: number
}

export function DataTable<T>({
  data = [],
  columns,
  variant = 'default',
  pagination,
  enableSorting = false,
  enableFiltering = false,
  enablePagination = false,
  pageSize = 10
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [currentPage, setCurrentPage] = useState(0)

  // Convert our columns to TanStack format
  const tanStackColumns = columns.map(column => ({
    ...column,
    cell: column.cell ? info => column.cell!(info.getValue(), info.row.original as T) : info => info.getValue()
  }))

  const table = useReactTable({
    data,
    columns: tanStackColumns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPage,
        pageSize
      }
    },
    enableSorting,
    enableColumnFilters: enableFiltering,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    manualPagination: pagination ? true : false
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (pagination?.goToPage) {
      pagination.goToPage(page)
    }
  }

  return (
    <div className="space-y-4">
      <TableV2.Root variant={variant}>
        <TableV2.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <TableV2.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableV2.Head
                  key={header.id}
                  className={cn(header.column.getCanSort() && 'cursor-pointer select-none')}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-4 w-4" />}
                    {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-4 w-4" />}
                  </div>
                </TableV2.Head>
              ))}
            </TableV2.Row>
          ))}
        </TableV2.Header>
        <TableV2.Body hasHighlightOnHover>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableV2.Row key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableV2.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableV2.Cell>
                ))}
              </TableV2.Row>
            ))
          ) : (
            <TableV2.Row>
              <TableV2.Cell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableV2.Cell>
            </TableV2.Row>
          )}
        </TableV2.Body>
      </TableV2.Root>

      {(pagination || enablePagination) && (
        <Pagination
          totalItems={pagination?.totalItems ?? data.length}
          pageSize={pagination?.pageSize ?? pageSize}
          currentPage={pagination?.currentPage ?? currentPage}
          goToPage={handlePageChange}
        />
      )}
    </div>
  )
}
