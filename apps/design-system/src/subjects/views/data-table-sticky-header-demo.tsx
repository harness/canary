import { useMemo, useState } from 'react'

import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'

import { DataTable, StatusBadge, Text } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  visits: number
}

const users: User[] = Array.from({ length: 32 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: index % 3 === 0 ? 'Admin' : index % 3 === 1 ? 'Developer' : 'Designer',
  status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'inactive' : 'pending',
  visits: 20 + index * 7
}))

const columnResizingProps = { _enableColumnResizing: true }

export const DataTableStickyHeaderDemo: React.FC = () => {
  const [tableSorting, setTableSorting] = useState<SortingState>([])

  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    setTableSorting(prev => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue))
  }

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        enableResizing: true,
        size: 160,
        cell: info => <Text color="foreground-1">{String(info.getValue())}</Text>
      },
      {
        id: 'profile',
        header: 'Profile',
        enableSorting: false,
        enableResizing: false,
        columns: [
          {
            id: 'email',
            accessorKey: 'email',
            header: 'Email',
            enableSorting: true,
            enableResizing: true,
            size: 240,
            cell: info => <Text color="foreground-1">{String(info.getValue())}</Text>
          },
          {
            id: 'role',
            accessorKey: 'role',
            header: 'Role',
            enableResizing: true,
            size: 140,
            cell: info => <Text color="foreground-1">{String(info.getValue())}</Text>
          },
          {
            id: 'visits',
            accessorKey: 'visits',
            header: 'Visits',
            enableSorting: true,
            enableResizing: true,
            size: 120,
            cell: info => <Text color="foreground-1">{String(info.getValue())}</Text>
          }
        ]
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        enableResizing: true,
        size: 120,
        cell: info => {
          const value = String(info.getValue()) as User['status']
          const theme = value === 'active' ? 'success' : value === 'inactive' ? 'danger' : 'warning'

          return (
            <StatusBadge variant="secondary" theme={theme} size="sm">
              {value}
            </StatusBadge>
          )
        }
      }
    ],
    []
  )

  const sortedData = useMemo(() => {
    if (tableSorting.length === 0) return users

    const sort = tableSorting[0]
    const key = sort.id as keyof User

    return [...users].sort((a, b) => {
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
        <div className="flex flex-col gap-cn-md">
          <Text variant="body-normal">
            Drag a header cell&apos;s right edge to resize it, then scroll vertically and horizontally to verify sticky
            headers and pinned columns.
          </Text>
          <div className="h-80">
            <DataTable<User>
              columns={columns}
              data={sortedData}
              getRowId={row => row.id.toString()}
              size="compact"
              className="h-full"
              currentSorting={tableSorting}
              onSortingChange={handleSortingChange}
              enableStickyHeader
              columnPinning={{ left: ['name'], right: ['status'] }}
              {...columnResizingProps}
            />
          </div>
        </div>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableStickyHeaderDemo
