import { useState } from 'react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
  useReactTable
} from '@tanstack/react-table'

import { Checkbox } from './checkbox'
import { IconV2 } from './icon-v2'
import { Pagination, PaginationProps } from './pagination/pagination'
import { TableV2 } from './table-v2'

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  size?: 'default' | 'relaxed' | 'compact'
  pagination?: PaginationProps
  getRowClassName?: (row: Row<TData>) => string | undefined
  onRowClick?: (data: TData, index: number) => void
  disableHighlightOnHover?: boolean
  className?: string
  currentSorting?: SortingState
  currentRowSelection?: RowSelectionState
  /**
   * Callback for when sorting changes. Use this for server-side sorting.
   */
  onSortingChange?: OnChangeFn<SortingState>
  /**
   * Enable row selection
   */
  enableRowSelection?: boolean
  /**
   * Default row selection state
   */
  defaultRowSelection?: RowSelectionState
  /**
   * Callback for when row selection changes
   */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export function DataTable<TData>({
  data = [],
  columns,
  size = 'default',
  pagination,
  getRowClassName,
  onRowClick,
  disableHighlightOnHover = false,
  className,
  currentSorting,
  currentRowSelection,
  onSortingChange: externalOnSortingChange,
  enableRowSelection = false,
  onRowSelectionChange: externalOnRowSelectionChange
}: DataTableProps<TData>) {
  // If row selection is enabled, add a checkbox column at the beginning
  const columnsWithSelection = enableRowSelection
    ? [
        {
          id: 'select',
          header: ({ table }: { table: Table<TData> }) => {
            // Create a handler function that can be safely passed to onChange
            const handleToggleAll = () => {
              table.toggleAllRowsSelected()
            }

            return (
              <Checkbox
                checked={table.getIsSomeRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
                onCheckedChange={handleToggleAll}
                aria-label="Select all rows"
              />
            )
          },
          cell: ({ row }: { row: Row<TData> }) => {
            return (
              <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={row.getToggleSelectedHandler()}
                aria-label="Select row"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            )
          },
          size: 40
        },
        ...columns
      ]
    : columns

  const tableOptions: TableOptions<TData> = {
    data,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    // Enable manual sorting (server-side sorting)
    manualSorting: true,
    // Use the external sorting change handler, we link it to the onSortingChange handler so we dont have to do shenannigans to figure out which column was clicked, and its sort state
    //  React table gives it to us directly
    onSortingChange: externalOnSortingChange,
    // Enable row selection if specified
    enableRowSelection,
    // Handle row selection changes
    onRowSelectionChange: externalOnRowSelectionChange,
    // We pass the currentSorting and rowSelection to the state so that react - table internally knows what state to maintain and toggle to onClick
    // React table internally maintains state for each column, so we dont have to do it ourselves
    state: {
      sorting: currentSorting,
      rowSelection: currentRowSelection
    }
  }

  const table = useReactTable(tableOptions)

  return (
    <div className={className}>
      <TableV2.Root variant={size} disableHighlightOnHover={disableHighlightOnHover}>
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
                        {header.column.getIsSorted() === 'asc' && <IconV2 name="arrow-up" size={12} />}
                        {header.column.getIsSorted() === 'desc' && <IconV2 name="arrow-down" size={12} />}
                        {!header.column.getIsSorted() && <IconV2 name="sort-1" size={16} />}
                      </span>
                    )}
                  </div>
                </TableV2.Head>
              ))}
            </TableV2.Row>
          ))}
        </TableV2.Header>
        <TableV2.Body>
          {table.getRowModel().rows.map(row => (
            <TableV2.Row
              key={row.id}
              className={getRowClassName?.(row)}
              onClick={onRowClick ? () => onRowClick(row.original, row.index) : undefined}
              selected={enableRowSelection ? row.getIsSelected() : undefined}
            >
              {row.getVisibleCells().map(cell => (
                <TableV2.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableV2.Cell>
              ))}
            </TableV2.Row>
          ))}
        </TableV2.Body>
      </TableV2.Root>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          pageSize={pagination.pageSize || 10}
          totalItems={pagination.totalItems || 0}
          goToPage={pagination?.goToPage || (() => {})}
          indeterminate={false}
        />
      )}
    </div>
  )
}
