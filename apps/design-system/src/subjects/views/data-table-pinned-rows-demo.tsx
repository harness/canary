import { useMemo, useState } from 'react'

import type { ColumnDef, ColumnPinningState, RowPinningState } from '@tanstack/react-table'

import { DataTable, Layout, Text } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

type Sale = {
  id: string
  product: string
  region: string
  q1: number
  q2: number
  q3: number
  q4: number
  total: number
}

const GRAND_TOTAL_ID = 'grand-total'

const products = ['API Gateway', 'Web App', 'Mobile SDK', 'CLI Tool', 'Dashboard', 'Connector']
const regions = ['NA', 'EMEA', 'APAC']

const sales: Sale[] = Array.from({ length: 18 }, (_, i) => {
  const q1 = 120 + ((i * 41) % 380)
  const q2 = 150 + ((i * 53) % 320)
  const q3 = 100 + ((i * 29) % 410)
  const q4 = 180 + ((i * 67) % 290)
  return {
    id: `sale-${i + 1}`,
    product: `${products[i % products.length]} ${Math.floor(i / products.length) + 1}`,
    region: regions[i % regions.length],
    q1,
    q2,
    q3,
    q4,
    total: q1 + q2 + q3 + q4
  }
})

const sum = (rows: Sale[], key: 'q1' | 'q2' | 'q3' | 'q4' | 'total') => rows.reduce((acc, row) => acc + row[key], 0)

const buildGrandTotal = (rows: Sale[]): Sale => ({
  id: GRAND_TOTAL_ID,
  product: 'Grand total',
  region: '',
  q1: sum(rows, 'q1'),
  q2: sum(rows, 'q2'),
  q3: sum(rows, 'q3'),
  q4: sum(rows, 'q4'),
  total: sum(rows, 'total')
})

const grandTotalRowClassName = '[&>td]:font-medium'

const useSalesColumns = (): ColumnDef<Sale>[] =>
  useMemo(
    () => [
      {
        id: 'product',
        accessorKey: 'product',
        header: 'Product',
        size: 220
      },
      { id: 'region', accessorKey: 'region', header: 'Region', size: 120 },
      { id: 'q1', accessorKey: 'q1', header: 'Q1', size: 140 },
      { id: 'q2', accessorKey: 'q2', header: 'Q2', size: 140 },
      { id: 'q3', accessorKey: 'q3', header: 'Q3', size: 140 },
      { id: 'q4', accessorKey: 'q4', header: 'Q4', size: 140 },
      { id: 'total', accessorKey: 'total', header: 'Total', size: 160 }
    ],
    []
  )

export const DataTablePinnedRowsDemo: React.FC = () => {
  const columns = useSalesColumns()

  const tallData = useMemo(() => [...sales, buildGrandTotal(sales)], [])
  const fewSales = sales.slice(0, 2)
  const shortData = useMemo(() => [...fewSales, buildGrandTotal(fewSales)], [fewSales])

  const [rowPinning] = useState<RowPinningState>({ bottom: [GRAND_TOTAL_ID] })
  const [cornerPinning] = useState<ColumnPinningState>({ left: ['product'], right: ['total'] })

  return (
    <SandboxLayout.Main className="flex items-center justify-center">
      <SandboxLayout.Content className="w-full max-w-[900px] justify-center">
        <Layout.Vertical gap="2xl" className="w-full">
          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Grand total pinned to the bottom</Text>
            <Text variant="body-normal" color="foreground-3">
              Scroll the body — the grand total row stays pinned to the bottom of the viewport, below the sticky header.
            </Text>
            <DataTable<Sale>
              columns={columns}
              data={tallData}
              getRowId={row => row.id}
              stickyHeader
              maxHeight={340}
              rowPinning={rowPinning}
              getRowClassName={row => (row.original.id === GRAND_TOTAL_ID ? grandTotalRowClassName : undefined)}
            />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Short table</Text>
            <Text variant="body-normal" color="foreground-3">
              With fewer rows than the viewport (2 rows in a 480px viewport), whitespace opens between the body rows and
              the pinned total instead of the total collapsing up against the last row. The total anchors to the bottom
              of the viewport box.
            </Text>
            <div style={{ height: 480, border: '1px dashed var(--cn-border-2)', borderRadius: 8, overflow: 'hidden' }}>
              <DataTable<Sale>
                columns={columns}
                data={shortData}
                getRowId={row => row.id}
                stickyHeader
                maxHeight={480}
                rowPinning={rowPinning}
                getRowClassName={row => (row.original.id === GRAND_TOTAL_ID ? grandTotalRowClassName : undefined)}
              />
            </div>
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Row + column pinning — grand total corner</Text>
            <Text variant="body-normal" color="foreground-3">
              The Product column is pinned left and the Total column right. Scroll both axes — the bottom-left and
              bottom-right corner cells of the pinned row layer above both directions.
            </Text>
            <div style={{ width: 680, maxWidth: '100%' }}>
              <DataTable<Sale>
                columns={columns}
                data={tallData}
                getRowId={row => row.id}
                stickyHeader
                maxHeight={340}
                rowPinning={rowPinning}
                columnPinning={cornerPinning}
                getRowClassName={row => (row.original.id === GRAND_TOTAL_ID ? grandTotalRowClassName : undefined)}
              />
            </div>
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">With pagination</Text>
            <Text variant="body-normal" color="foreground-3">
              The grand total stays pinned on every page (keepPinnedRows), and the pagination bar stays parked below the
              scroll viewport.
            </Text>
            <DataTable<Sale>
              columns={columns}
              data={tallData}
              getRowId={row => row.id}
              stickyHeader
              maxHeight={340}
              rowPinning={rowPinning}
              paginationProps={{ totalItems: 72, pageSize: 18, currentPage: 1, goToPage: () => {} }}
              getRowClassName={row => (row.original.id === GRAND_TOTAL_ID ? grandTotalRowClassName : undefined)}
            />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Short table + left and right pinned columns</Text>
            <Text variant="body-normal" color="foreground-3">
              The full combination: few rows (spacer gap), sticky header, and both column edges pinned. Scroll both axes
              and watch both grand-total corner cells.
            </Text>
            <div style={{ width: 680, maxWidth: '100%' }}>
              <DataTable<Sale>
                columns={columns}
                data={shortData}
                getRowId={row => row.id}
                stickyHeader
                maxHeight={340}
                rowPinning={rowPinning}
                columnPinning={cornerPinning}
                getRowClassName={row => (row.original.id === GRAND_TOTAL_ID ? grandTotalRowClassName : undefined)}
              />
            </div>
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTablePinnedRowsDemo
