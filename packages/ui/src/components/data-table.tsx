import { useState } from 'react'

import {
  ColumnDef,
  ExpandedState,
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
import { cn } from '@utils/cn'

import { Checkbox } from './checkbox'
import { Icon } from './icon'
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
   * Function to determine if a row can be expanded
   */
  getRowCanExpand?: (row: Row<TData>) => boolean
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
  /**
   * Enable column resizing
   */
  enableColumnResizing?: boolean
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
  getRowCanExpand,
  currentExpanded,
  onExpandedChange: externalOnExpandedChange,
  renderSubComponent,
  enableColumnResizing = false
}: DataTableProps<TData>) {
  // Start with the base columns
  let enhancedColumns = [...columns]

  // If row selection is enabled, add a checkbox column at the beginning
  if (enableRowSelection) {
    enhancedColumns = [
      {
        id: 'select',
        header: ({ table }: { table: Table<TData> }) => {
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
        size: 20
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
          return row.getCanExpand() ? (
            <div
              onClick={e => {
                e.stopPropagation()
                row.toggleExpanded()
              }}
              aria-label="Toggle Row Expanded"
              role="button"
              tabIndex={0}
              className="cursor-pointer flex items-center justify-center hover:text-cn-foreground-1 !pr-0"
            >
              <Icon name={row.getIsExpanded() ? 'chevron-down' : 'chevron-up'} size={12} />
            </div>
          ) : null
        },
        size: 20
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
    // enable manual expansion
    manualExpanding: true,
    // Handle expanded state changes
    onExpandedChange: externalOnExpandedChange,
    // Use custom getRowCanExpand function if provided, otherwise make all rows expandable if expansion is enabled
    getRowCanExpand: enableExpanding ? getRowCanExpand || (() => true) : undefined,
    // Enable column resizing if specified
    enableColumnResizing,
    columnResizeMode: 'onChange',
    // We pass the currentSorting, rowSelection, and expanded state so that react-table internally knows what state to maintain
    state: {
      sorting: currentSorting,
      rowSelection: currentRowSelection || {},
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
                  className={cn(enableColumnResizing ? 'relative' : undefined)}
                  sortable={header.column.getCanSort()}
                  sortDirection={header.column.getCanSort() ? header.column.getIsSorted() || false : undefined}
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  style={{
                    width: header.getSize()
                  }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {enableColumnResizing && header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300"
                    />
                  )}
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
              {row.getIsExpanded() && renderSubComponent && (
                <TableV2.Row key={`${row.id}-expanded`} className="bg-cn-background-2">
                  <TableV2.Cell></TableV2.Cell>
                  <TableV2.Cell colSpan={row.getAllCells().length - 1}>{renderSubComponent({ row })}</TableV2.Cell>
                </TableV2.Row>
              )}
            </>
          ))}
        </TableV2.Body>
      </TableV2.Root>

      {pagination && <Pagination {...pagination} />}
    </div>
  )
}
