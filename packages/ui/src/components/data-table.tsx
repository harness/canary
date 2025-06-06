import { useState } from 'react'

import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  TableOptions,
  useReactTable
} from '@tanstack/react-table'

import { Button } from './button'
import { Checkbox } from './checkbox'
import { Icon } from './icon'
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
  /**
   * Enable expandable rows
   */
  enableExpanding?: boolean
  /**
   * Current expanded rows state
   */
  currentExpanded?: ExpandedState
  /**
   * Callback for when expanded state changes
   */
  onExpandedChange?: OnChangeFn<ExpandedState>
  /**
   * Render function for expanded row content
   */
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
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
  onRowSelectionChange: externalOnRowSelectionChange,
  enableExpanding = false,
  currentExpanded,
  onExpandedChange: externalOnExpandedChange,
  renderSubComponent
}: DataTableProps<TData>) {
  // Start with the base columns
  let enhancedColumns = [...columns]

  // If row selection is enabled, add a checkbox column at the beginning
  if (enableRowSelection) {
    enhancedColumns = [
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
      ...enhancedColumns
    ]
  }

  // If expanding is enabled, add an expander column at the beginning
  if (enableExpanding) {
    enhancedColumns = [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }: { row: Row<TData> }) => {
          return (
            <Button
              type="button"
              variant="ghost"
              iconOnly
              onClick={e => {
                e.stopPropagation()
                row.toggleExpanded()
              }}
              aria-label="Toggle Row Expanded"
            >
              {row.getIsExpanded() ? <Icon name="chevron-down" size={16} /> : <Icon name="chevron-up" size={16} />}
            </Button>
          )
        },
        size: 40
      },
      ...enhancedColumns
    ]
  }

  const columnsWithSelection = enhancedColumns

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
    // Enable row expansion if specified
    enableExpanding,
    // Get expanded row model for rendering expanded rows
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    // Handle expanded state changes
    onExpandedChange: externalOnExpandedChange,
    // Make all rows expandable if expansion is enabled
    getRowCanExpand: enableExpanding ? () => true : undefined,
    // We pass the currentSorting, rowSelection, and expanded state so that react-table internally knows what state to maintain
    state: {
      sorting: currentSorting,
      // Make sure rowSelection is always an object, even if undefined
      rowSelection: currentRowSelection || {},
      // Set expanded state if provided
      expanded: currentExpanded || {}
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
            <>
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
              {/* Render expanded content if row is expanded */}
              {row.getIsExpanded() && renderSubComponent && (
                <TableV2.Row key={`${row.id}-expanded`} className="expanded-row">
                  <TableV2.Cell colSpan={row.getVisibleCells().length} className="p-0">
                    {renderSubComponent({ row })}
                  </TableV2.Cell>
                </TableV2.Row>
              )}
            </>
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
