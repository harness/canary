import { DataTable as DataTableRoot, type DataTableProps } from './data-table'
import {
  DataTableColumnFilterDropdown,
  type DataTableColumnFilterDropdownProps
} from './data-table-columns-filter-dropdown'

export const DataTable = Object.assign(DataTableRoot, {
  ColumnFilter: DataTableColumnFilterDropdown
})

export { type DataTableColumnFilterDropdownProps, type DataTableProps }
