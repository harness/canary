import { useCallback, useMemo } from 'react'

import { CheckboxOptions } from '@harnessio/ui/components'

import { useLocalStorage } from './use-local-storage'

interface UseColumnFilterProps {
  /**
   * Unique key for localStorage persistence
   */
  storageKey: string
  /**
   * Available columns configuration
   */
  columns: CheckboxOptions[]
  /**
   * Default visible columns (used when no localStorage value exists)
   */
  defaultVisibleColumns?: string[]
}

interface UseColumnFilterReturn {
  /**
   * Currently visible column identifiers
   */
  visibleColumns: string[]
  /**
   * Toggle visibility of a specific column
   */
  toggleColumn: (columnName: string, checked: boolean) => void
  /**
   * Reset to default visible columns
   */
  resetColumns: () => void
}

/**
 * Hook that manages column visibility state with localStorage persistence
 * and returns a pre-configured DataTableColumnFilterDropdown component.
 *
 * @example
 * ```tsx
 * const columns = [
 *   { label: 'Name', value: 'name' },
 *   { label: 'Email', value: 'email' },
 *   { label: 'Status', value: 'status' }
 * ]
 *
 * const { visibleColumns, toggleColumn, resetColumns } = useColumnFilter({
 *   storageKey: 'users-table-columns',
 *   columns,
 *   defaultVisibleColumns: ['name', 'email']
 * })
 *
 * return (
 *   <div>
 *      <DataTable.ColumnFilter
 *        columns={columns}
 *        visibleColumns={visibleColumns}
 *        onCheckedChange={toggleColumn}
 *        onReset={resetColumns}
 *       />
 *     <DataTable columns={columns} visibleColumns={visibleColumns} />
 *   </div>
 * )
 * ```
 */
export function useColumnFilter({
  storageKey,
  columns,
  defaultVisibleColumns
}: UseColumnFilterProps): UseColumnFilterReturn {
  // Initialize default visible columns (all columns if not specified)
  const defaultColumns = useMemo(
    () => defaultVisibleColumns ?? columns.map(col => col.value),
    [defaultVisibleColumns, columns]
  )

  // Persist visible columns in localStorage
  const [visibleColumns, setVisibleColumns] = useLocalStorage<string[]>(storageKey, defaultColumns)

  // Toggle column visibility
  const toggleColumn = useCallback(
    (columnName: string, checked: boolean) => {
      if (checked) {
        // Add column if not already present
        const newColumns = visibleColumns.includes(columnName) ? visibleColumns : [...visibleColumns, columnName]
        setVisibleColumns(newColumns)
      } else {
        // Remove column
        const newColumns = visibleColumns.filter(col => col !== columnName)
        setVisibleColumns(newColumns)
      }
    },
    [visibleColumns, setVisibleColumns]
  )

  // Reset to default columns
  const resetColumns = useCallback(() => {
    setVisibleColumns(defaultColumns)
  }, [setVisibleColumns, defaultColumns])

  return {
    visibleColumns,
    toggleColumn,
    resetColumns
  }
}
