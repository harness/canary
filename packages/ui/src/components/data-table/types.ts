import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** Additional class names applied to the header cell */
    headerClassName?: string
    /** When true, applies group-header styling (auto-detected when column has nested `columns`) */
    isGroupHeader?: boolean
  }
}
