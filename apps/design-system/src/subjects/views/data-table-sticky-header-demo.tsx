import { useMemo, useState } from 'react'

import type { ColumnDef, ColumnPinningState, OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable, Layout, StatusBadge, Text } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

type Person = {
  id: number
  name: string
  age: number
  visits: number
  status: 'active' | 'inactive' | 'pending'
  profileProgress: number
}

const firstNames = ['Alice', 'Bob', 'Priya', 'Diego', 'Mei', 'Marcus', 'Elena', 'Raj', 'Sofia', 'Tom']
const lastNames = ['Chen', 'Martinez', 'Patel', 'Rivera', 'Lin', 'Lee', 'Novak', 'Sharma', 'Costa', 'Weber']
const statuses: Person['status'][] = ['active', 'inactive', 'pending']

const people: Person[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`,
  age: 24 + ((i * 7) % 30),
  visits: 10 + ((i * 37) % 190),
  status: statuses[i % statuses.length],
  profileProgress: 5 + ((i * 13) % 95)
}))

const statusBadge = (value: unknown) => {
  const status = String(value) as Person['status']
  const theme = status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'warning'
  return (
    <StatusBadge variant="secondary" theme={theme} size="sm">
      {status}
    </StatusBadge>
  )
}

const useClientSorting = (data: Person[]) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const onSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    setSorting(prev => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue))
  }

  const sortedData = useMemo(() => {
    if (sorting.length === 0) return data
    const sort = sorting[0]
    const key = sort.id as keyof Person
    return [...data].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return sort.desc ? 1 : -1
      if (aVal > bVal) return sort.desc ? -1 : 1
      return 0
    })
  }, [data, sorting])

  return { sorting, onSortingChange, sortedData }
}

export const DataTableStickyHeaderDemo: React.FC = () => {
  const basic = useClientSorting(people)
  const grouped = useClientSorting(people)
  const pinned = useClientSorting(people)

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: ['name'], right: ['status'] })

  const basicColumns: ColumnDef<Person>[] = useMemo(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
      { id: 'age', accessorKey: 'age', header: 'Age', enableSorting: true },
      { id: 'visits', accessorKey: 'visits', header: 'Visits', enableSorting: true },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: info => statusBadge(info.getValue())
      },
      { id: 'profileProgress', accessorKey: 'profileProgress', header: 'Profile Progress', enableSorting: true }
    ],
    []
  )

  const groupedColumns: ColumnDef<Person>[] = useMemo(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
      {
        id: 'info',
        header: 'Info',
        enableSorting: false,
        columns: [
          { id: 'age', accessorKey: 'age', header: 'Age', enableSorting: true },
          { id: 'visits', accessorKey: 'visits', header: 'Visits', enableSorting: true },
          {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            enableSorting: true,
            cell: info => statusBadge(info.getValue())
          },
          { id: 'profileProgress', accessorKey: 'profileProgress', header: 'Profile Progress', enableSorting: true }
        ]
      }
    ],
    []
  )

  const wideColumns: ColumnDef<Person>[] = useMemo(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Name', size: 180, enableSorting: true },
      { id: 'age', accessorKey: 'age', header: 'Age', size: 140, enableSorting: true },
      { id: 'visits', accessorKey: 'visits', header: 'Visits', size: 160, enableSorting: true },
      {
        id: 'profileProgress',
        accessorKey: 'profileProgress',
        header: 'Profile Progress',
        size: 200,
        enableSorting: true
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        enableSorting: false,
        cell: info => statusBadge(info.getValue())
      }
    ],
    []
  )

  return (
    <SandboxLayout.Main className="flex items-center justify-center">
      <SandboxLayout.Content className="w-full max-w-[900px] justify-center">
        <Layout.Vertical gap="2xl" className="w-full">
          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Sticky header</Text>
            <Text variant="body-normal" color="foreground-3">
              Scroll the table body — the header stays pinned and opaque, including on sortable-header hover.
            </Text>
            <DataTable<Person>
              columns={basicColumns}
              data={basic.sortedData}
              getRowId={row => String(row.id)}
              stickyHeader
              maxHeight={320}
              currentSorting={basic.sorting}
              onSortingChange={basic.onSortingChange}
            />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Sticky grouped headers</Text>
            <Text variant="body-normal" color="foreground-3">
              Both header rows stick with a continuous opaque background — body rows must not show through the gap
              between the group row and the leaf row.
            </Text>
            <DataTable<Person>
              columns={groupedColumns}
              data={grouped.sortedData}
              getRowId={row => String(row.id)}
              stickyHeader
              maxHeight={320}
              currentSorting={grouped.sorting}
              onSortingChange={grouped.onSortingChange}
            />
          </Layout.Vertical>

          <Layout.Vertical gap="md">
            <Text variant="heading-subsection">Sticky header + pinned columns</Text>
            <Text variant="body-normal" color="foreground-3">
              Scroll vertically and horizontally — the header and the pinned columns stay in place, and the top-left
              corner cells layer above both.
            </Text>
            <div style={{ width: 640, maxWidth: '100%' }}>
              <DataTable<Person>
                columns={wideColumns}
                data={pinned.sortedData}
                getRowId={row => String(row.id)}
                stickyHeader
                maxHeight={320}
                columnPinning={columnPinning}
                currentSorting={pinned.sorting}
                onSortingChange={pinned.onSortingChange}
              />
            </div>
            <Text variant="caption-normal">
              Column pinning: left [&quot;name&quot;], right [&quot;status&quot;] —{' '}
              <button
                type="button"
                className="underline"
                onClick={() =>
                  setColumnPinning(prev =>
                    prev.left?.length || prev.right?.length
                      ? { left: [], right: [] }
                      : { left: ['name'], right: ['status'] }
                  )
                }
              >
                toggle pinning
              </button>
            </Text>
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableStickyHeaderDemo
