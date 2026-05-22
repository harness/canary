import { useMemo, useState } from 'react'

import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable, StatusBadge } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

type Person = {
  name: string
  age: number
  visits: number
  status: 'active' | 'inactive' | 'pending'
  profileProgress: number
}

const people: Person[] = [
  { name: 'Alice Chen', age: 28, visits: 142, status: 'active', profileProgress: 88 },
  { name: 'Bob Martinez', age: 35, visits: 67, status: 'inactive', profileProgress: 42 },
  { name: 'Priya Patel', age: 31, visits: 203, status: 'active', profileProgress: 95 },
  { name: 'Diego Rivera', age: 26, visits: 18, status: 'pending', profileProgress: 25 },
  { name: 'Mei Lin', age: 42, visits: 178, status: 'active', profileProgress: 76 },
  { name: 'Marcus Lee', age: 30, visits: 91, status: 'active', profileProgress: 60 }
]

export const DataTableGroupedHeadersDemo: React.FC = () => {
  const [tableSorting, setTableSorting] = useState<SortingState>([])

  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    setTableSorting(prev => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue))
  }

  const columns: ColumnDef<Person>[] = useMemo(
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
            cell: info => {
              const value = String(info.getValue()) as Person['status']
              const theme = value === 'active' ? 'success' : value === 'inactive' ? 'danger' : 'warning'
              return (
                <StatusBadge variant="secondary" theme={theme} size="sm">
                  {value}
                </StatusBadge>
              )
            }
          },
          {
            id: 'profileProgress',
            accessorKey: 'profileProgress',
            header: 'Profile Progress',
            enableSorting: true
          }
        ]
      }
    ],
    []
  )

  const sortedData = useMemo(() => {
    if (tableSorting.length === 0) return people

    const sort = tableSorting[0]
    const key = sort.id as keyof Person

    return [...people].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return sort.desc ? 1 : -1
      if (aVal > bVal) return sort.desc ? -1 : 1
      return 0
    })
  }, [tableSorting])

  return (
    <SandboxLayout.Main className="flex items-center justify-center">
      <SandboxLayout.Content className="w-full max-w-[900px] justify-center">
        <DataTable<Person>
          columns={columns}
          data={sortedData}
          getRowId={row => row.name}
          size="normal"
          variant="default"
          currentSorting={tableSorting}
          onSortingChange={handleSortingChange}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableGroupedHeadersDemo
