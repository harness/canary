import { Fragment, useEffect, useMemo } from 'react'

import { Button, Checkbox, IconV2, PaginationProps, Table, tableVariants } from '@/components'
import {
  ColumnDef,
  ColumnPinningState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  TableOptions,
  Table as TanstackTable,
  useReactTable
} from '@tanstack/react-table'
import { cn } from '@utils/cn'
import { type VariantProps } from 'class-variance-authority'

import './types'

import { getCommonPinningStyles } from './utils'

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  size?: VariantProps<typeof tableVariants>['size']
  variant?: VariantProps<typeof tableVariants>['variant']
  paginationProps?: PaginationProps
  getRowClassName?: (row: Row<TData>) => string | undefined
  onRowClick?: (data: TData, index: number) => void
  disableHighlightOnHover?: boolean
  className?: string
  currentSorting?: SortingState
  currentRowSelection?: RowSelectionState
  columnPinning?: ColumnPinningState

  /**
   * Array of column IDs to be visible
   */
  visibleColumns?: string[]

  getRowId?: (row: TData) => string
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
   * Function to determine if a row can be selected
   */
  getRowCanSelect?: (row: Row<TData>) => boolean
  /**
   * Function to determine if a row is disabled.
   * Disabled rows have reduced opacity, show a not-allowed cursor,
   * and cannot be clicked, selected, or expanded.
   */
  getIsRowDisabled?: (row: Row<TData>) => boolean
  /**
   * Function to generate a navigation link for a row.
   * When provided, the row renders as a link navigating to the returned URL.
   */
  getRowLink?: (data: TData, index: number) => string
  /**
   * When true, all rows are expanded initially. Defaults to false (all collapsed).
   * Overridden by `currentExpanded` when provided.
   */
  initiallyExpandAllRows?: boolean
  /**
   * Current expanded rows state
   */
  currentExpanded?: ExpandedState
  /**
   * Callback for when expanded state changes
   */
  onExpandedChange?: OnChangeFn<ExpandedState>
  /**
   * Render function for expanded row content (detail-panel mode).
   * Ignored when `getSubRows` is provided (tree mode).
   */
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
  /**
   * Extract child rows from a data item to enable tree/nested row mode.
   * When provided, expanded rows render their children as indented table rows
   * sharing the same column structure, instead of a detail-panel sub-component.
   */
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined
  /**
   * @internal
   * Enable column resizing - NOT READY FOR PUBLIC USE
   * This prop is for internal development only and should not be used
   */
  _enableColumnResizing?: boolean
}

export const DataTable = function DataTable<TData>({
  data = [],
  columns,
  size = 'normal',
  variant = 'default',
  paginationProps,
  getRowClassName,
  onRowClick,
  getRowLink,
  disableHighlightOnHover = false,
  className,
  currentSorting,
  currentRowSelection,
  onSortingChange: externalOnSortingChange,
  enableRowSelection = false,
  onRowSelectionChange: externalOnRowSelectionChange,
  enableExpanding = false,
  getRowCanExpand,
  getRowCanSelect,
  getIsRowDisabled,
  initiallyExpandAllRows = false,
  currentExpanded,
  onExpandedChange: externalOnExpandedChange,
  renderSubComponent,
  getSubRows,
  _enableColumnResizing = false,
  getRowId,
  visibleColumns,
  columnPinning = { left: [], right: [] }
}: DataTableProps<TData>) {
  const tableColumns = useMemo(() => {
    // Start with the base columns
    let cols = [...columns]

    // If row selection is enabled, add a checkbox column at the beginning
    if (enableRowSelection) {
      cols = [
        {
          id: 'select',
          header: ({ table }: { table: TanstackTable<TData> }) => {
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
        ...cols
      ]
    }

    if (enableExpanding) {
      const isTree = !!getSubRows

      if (isTree) {
        const firstDataColIndex = 0
        const firstCol = cols[firstDataColIndex]
        const originalCell = firstCol.cell

        cols[firstDataColIndex] = {
          ...firstCol,
          cell: (info: any) => {
            const { row } = info
            const indent = row.depth > 0 ? { paddingLeft: `calc(${row.depth} * var(--cn-layout-2xl))` } : undefined

            const originalContent = typeof originalCell === 'function' ? originalCell(info) : info.getValue()

            return (
              <div style={indent} data-depth={row.depth} className="flex items-center gap-cn-sm">
                <span className="inline-flex w-5 shrink-0 justify-center">
                  {row.getCanExpand() ? (
                    <Button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        row.toggleExpanded()
                      }}
                      aria-label="Toggle Row Expanded"
                      variant="ghost"
                      size="xs"
                      iconOnly
                      role="button"
                    >
                      <IconV2 name={row.getIsExpanded() ? 'nav-arrow-down' : 'nav-arrow-right'} size="2xs" />
                    </Button>
                  ) : null}
                </span>
                <span className="min-w-0">{originalContent}</span>
              </div>
            )
          }
        }
      } else {
        cols = [
          {
            id: 'expander',
            header: () => null,
            enableHiding: false,
            cell: ({ row }: { row: Row<TData> }) => {
              return row.getCanExpand() ? (
                <Button
                  onClick={e => {
                    e.stopPropagation()
                    row.toggleExpanded()
                  }}
                  aria-label="Toggle Row Expanded"
                  variant="ghost"
                  size="xs"
                  iconOnly
                  role="button"
                  tooltipProps={{
                    content: 'Toggle Row Expanded'
                  }}
                >
                  <IconV2 name={row.getIsExpanded() ? 'nav-arrow-down' : 'nav-arrow-right'} size="2xs" />
                </Button>
              ) : null
            },
            size: 20
          },
          ...cols
        ]
      }
    }

    return cols
  }, [columns, enableRowSelection, enableExpanding, getSubRows])

  const tableOptions = useMemo<TableOptions<TData>>(
    () => ({
      data,
      columns: tableColumns,
      getCoreRowModel: getCoreRowModel(),

      getRowId: getRowId,
      // Enable manual sorting (server-side sorting)
      manualSorting: true,
      // Use the external sorting change handler, we link it to the onSortingChange handler so we dont have to do shenannigans to figure out which column was clicked, and its sort state
      //  React table gives it to us directly
      onSortingChange: externalOnSortingChange,
      // Enable row selection if specified
      enableRowSelection: enableRowSelection
        ? (row: Row<TData>) => !getIsRowDisabled?.(row) && (getRowCanSelect?.(row) ?? true)
        : undefined,
      // Handle row selection changes
      onRowSelectionChange: externalOnRowSelectionChange,
      enableExpanding,
      onExpandedChange: externalOnExpandedChange,
      getRowCanExpand: enableExpanding
        ? (row: Row<TData>) => {
            if (getIsRowDisabled?.(row)) return false
            if (getRowCanExpand) return getRowCanExpand(row)
            if (getSubRows) return (row.subRows?.length ?? 0) > 0
            return true
          }
        : undefined,
      ...(getSubRows
        ? {
            getSubRows,
            getExpandedRowModel: getExpandedRowModel()
          }
        : {
            manualExpanding: true
          }),
      // Enable column resizing if specified
      enableColumnResizing: _enableColumnResizing,
      columnResizeMode: 'onChange',
      // We pass the currentSorting, rowSelection, and expanded state so that react-table internally knows what state to maintain

      state: {
        sorting: currentSorting,
        rowSelection: currentRowSelection || {},
        expanded: currentExpanded ?? (initiallyExpandAllRows ? true : {}),
        columnPinning
      }
    }),
    [
      data,
      tableColumns,
      getRowId,
      externalOnSortingChange,
      enableRowSelection,
      getRowCanSelect,
      getIsRowDisabled,
      externalOnRowSelectionChange,
      enableExpanding,
      externalOnExpandedChange,
      getRowCanExpand,
      getSubRows,
      _enableColumnResizing,
      currentSorting,
      currentRowSelection,
      initiallyExpandAllRows,
      currentExpanded,
      columnPinning
    ]
  )

  const table = useReactTable(tableOptions)

  // Set the visible columns
  useEffect(() => {
    if (!table || !visibleColumns) {
      return
    }

    const hideableColumns = table.getAllColumns()?.filter(column => column.getCanHide())

    if (hideableColumns) {
      hideableColumns.forEach(column => {
        column.toggleVisibility(visibleColumns?.includes(column.id) || false)
      })
    }
  }, [table, visibleColumns])

  const hasPinnedColumns = useMemo(
    () => Boolean(columnPinning?.left?.length || columnPinning?.right?.length),
    [columnPinning]
  )

  return (
    <Table.Root
      className={className}
      /* If there are pinned columns, we need to set the table to fixed layout to prevent columns
       *  from resizing based on their content.
       */
      tableClassName={cn({ 'table-fixed': hasPinnedColumns })}
      size={size}
      variant={variant}
      disableHighlightOnHover={disableHighlightOnHover}
      paginationProps={paginationProps}
    >
      <Table.Header>
        {(() => {
          const headerGroups = table.getHeaderGroups()
          const totalHeaderRows = headerGroups.length
          const hasGroupedHeaders = totalHeaderRows > 1

          return headerGroups.map((headerGroup, rowIdx) => (
            <Table.Row key={headerGroup.id} data-header-depth={rowIdx}>
              {headerGroup.headers.map(header => {
                const column = header.column
                const meta = column.columnDef.meta
                const isLeafColumn = column.columns.length === 0
                /**
                 * A top-level leaf column when other top-level columns are groups.
                 * TanStack inserts a placeholder header for it at each shallower
                 * depth, and renders the real header at the deepest depth.
                 * We instead render the real header once at row 0 with a vertical
                 * rowSpan, mirroring the typical grouped-header UI.
                 */
                const isFloatingTopLevelLeaf = hasGroupedHeaders && isLeafColumn && !column.parent

                if (isFloatingTopLevelLeaf) {
                  if (rowIdx > 0) return null
                } else if (header.isPlaceholder) {
                  return null
                }

                const rowSpan = isFloatingTopLevelLeaf ? totalHeaderRows : 1
                const canSort = column.getCanSort()
                const isGroupHeaderCell = meta?.isGroupHeader ?? !isLeafColumn

                return (
                  <Table.Head
                    colSpan={header.colSpan}
                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                    key={header.id}
                    data-header-depth={rowIdx}
                    className={cn(
                      _enableColumnResizing ? 'relative' : undefined,
                      meta?.headerClassName,
                      isGroupHeaderCell && 'cn-table-v2-head-group',
                      isLeafColumn && !isGroupHeaderCell && 'cn-table-v2-head-leaf'
                    )}
                    sortable={canSort}
                    sortDirection={canSort ? column.getIsSorted() || false : undefined}
                    onClick={canSort ? column.getToggleSortingHandler() : undefined}
                    style={{
                      width: header.getSize(),
                      minWidth: column.columnDef.minSize ?? header.getSize(),
                      maxWidth: column.columnDef.maxSize ?? header.getSize(),
                      ...getCommonPinningStyles<TData>(column)
                    }}
                  >
                    {flexRender(column.columnDef.header, header.getContext())}
                    {_enableColumnResizing && column.getCanResize() && (
                      <button
                        type="button"
                        onMouseDown={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                        aria-label="Resize column"
                      />
                    )}
                  </Table.Head>
                )
              })}
            </Table.Row>
          ))
        })()}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map(row => (
          <Fragment key={row.id}>
            <Table.Row
              className={getRowClassName?.(row)}
              onClick={onRowClick && !getIsRowDisabled?.(row) ? () => onRowClick(row.original, row.index) : undefined}
              to={getRowLink && !getIsRowDisabled?.(row) ? getRowLink(row.original, row.index) : undefined}
              selected={enableRowSelection ? row.getIsSelected() : undefined}
              disabled={getIsRowDisabled?.(row)}
            >
              {row.getVisibleCells().map(cell => {
                const column = cell.column
                return (
                  <Table.Cell
                    key={cell.id}
                    // Temporary fix to prevent text bleeding in cell when it is pinned
                    className={cn({ 'cn-table-v2-cell-pinned': column.getIsPinned() })}
                    style={{
                      ...getCommonPinningStyles<TData>(column),
                      width: column.getSize(),
                      minWidth: column.columnDef.minSize ?? column.getSize(),
                      maxWidth: column.columnDef.maxSize ?? column.getSize()
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                )
              })}
            </Table.Row>
            {row.getIsExpanded() && renderSubComponent && !getSubRows && (
              <Table.Row className="bg-cn-2">
                <Table.Cell className="bg-transparent"></Table.Cell>
                <Table.Cell className="bg-transparent" colSpan={row.getAllCells().length - 1}>
                  {renderSubComponent({ row })}
                </Table.Cell>
              </Table.Row>
            )}
          </Fragment>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
