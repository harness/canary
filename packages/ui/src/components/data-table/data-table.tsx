import { useEffect, useMemo } from 'react'

import { Button, Checkbox, IconV2, PaginationProps, Table, tableVariants } from '@/components'
import {
  ColumnDef,
  ColumnPinningState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
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

import { getCommonPinningStyles } from './utils'

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  size?: VariantProps<typeof tableVariants>['size']
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
  paginationProps,
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
  getRowCanSelect,
  currentExpanded,
  onExpandedChange: externalOnExpandedChange,
  renderSubComponent,
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

    // If expanding is enabled, add an expander column at the beginning
    if (enableExpanding) {
      cols = [
        {
          id: 'expander',
          header: () => null,
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
                <IconV2 name={row.getIsExpanded() ? 'nav-arrow-down' : 'nav-arrow-up'} size="2xs" />
              </Button>
            ) : null
          },
          size: 20
        },
        ...cols
      ]
    }

    return cols
  }, [columns, enableRowSelection, enableExpanding])

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
      enableRowSelection: enableRowSelection ? getRowCanSelect || (() => true) : undefined,
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
      enableColumnResizing: _enableColumnResizing,
      columnResizeMode: 'onChange',
      // We pass the currentSorting, rowSelection, and expanded state so that react-table internally knows what state to maintain

      state: {
        sorting: currentSorting,
        rowSelection: currentRowSelection || {},
        expanded: currentExpanded || {},
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
      externalOnRowSelectionChange,
      enableExpanding,
      externalOnExpandedChange,
      getRowCanExpand,
      _enableColumnResizing,
      currentSorting,
      currentRowSelection,
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
      disableHighlightOnHover={disableHighlightOnHover}
      paginationProps={paginationProps}
    >
      <Table.Header>
        {table.getHeaderGroups().map(headerGroup => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Table.Head
                colSpan={header.colSpan}
                key={header.id}
                className={cn(_enableColumnResizing ? 'relative' : undefined)}
                sortable={header.column.getCanSort()}
                sortDirection={header.column.getCanSort() ? header.column.getIsSorted() || false : undefined}
                onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize ?? header.getSize(),
                  maxWidth: header.column.columnDef.maxSize ?? header.getSize(),
                  ...getCommonPinningStyles<TData>(header.column)
                }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {_enableColumnResizing && header.column.getCanResize() && (
                  <button
                    type="button"
                    onMouseDown={header.getResizeHandler()}
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                    aria-label="Resize column"
                  />
                )}
              </Table.Head>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map(row => (
          <>
            <Table.Row
              key={row.id}
              className={getRowClassName?.(row)}
              onClick={onRowClick ? () => onRowClick(row.original, row.index) : undefined}
              selected={enableRowSelection ? row.getIsSelected() : undefined}
            >
              {row.getVisibleCells().map(cell => {
                const column = cell.column
                return (
                  <Table.Cell
                    key={cell.id}
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
            {row.getIsExpanded() && renderSubComponent && (
              <Table.Row key={`${row.id}-expanded`} className="bg-cn-2">
                <Table.Cell></Table.Cell>
                <Table.Cell colSpan={row.getAllCells().length - 1}>{renderSubComponent({ row })}</Table.Cell>
              </Table.Row>
            )}
          </>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
