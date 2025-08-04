import { useMemo, useState } from 'react'

import type { ColumnDef, ExpandedState, OnChangeFn, Row, RowSelectionState, SortingState } from '@tanstack/react-table'

import { DataTable, StatusBadge } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

type User = {
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
}

const users: User[] = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2025-06-01'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Developer',
    status: 'active',
    lastLogin: '2025-06-02'
  },
  {
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Designer',
    status: 'inactive',
    lastLogin: '2025-05-28'
  },
  {
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'Product Manager',
    status: 'pending',
    lastLogin: '2025-06-03'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Developer',
    status: 'active',
    lastLogin: '2025-06-01'
  }
]

export const DataTableDemo: React.FC = () => {
  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Row expansion state
  const [expanded, setExpanded] = useState<ExpandedState>({})

  // Sorting state for server-side sorting
  const [tableSorting, setTableSorting] = useState<SortingState>([])

  // Log selection changes
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = updaterOrValue => {
    const newSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue
    setRowSelection(newSelection)
  }

  // Handle expanded state changes
  const handleExpandedChange: OnChangeFn<ExpandedState> = updaterOrValue => {
    const newExpanded = typeof updaterOrValue === 'function' ? updaterOrValue(expanded) : updaterOrValue
    setExpanded(newExpanded)
  }

  // Render expanded row content
  const renderSubComponent = ({ row }: { row: Row<User> }) => {
    const user = row.original
    return (
      <div className="py-1">
        <p>This is a placeholder for expanded content for {user.name}</p>
      </div>
    )
  }

  // Define columns for the data table
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        cell: info => <div className="font-medium">{String(info.getValue())}</div>
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true
      },
      {
        accessorKey: 'role',
        header: 'Role',
        enableSorting: false
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: info => {
          const status = String(info.getValue())
          return (
            <StatusBadge
              variant="secondary"
              theme={status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'warning'}
              size="sm"
              className="py-0"
            >
              {status}
            </StatusBadge>
          )
        }
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        enableSorting: true
      }
    ],
    []
  )

  // This function would typically make an API call to fetch sorted data
  // In a real app, you would fetch data from the server with the new sorting parameters
  // For this demo, we'll just sort the data client-side to simulate server-side sorting
  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(tableSorting) : updaterOrValue

    setTableSorting(newSorting)
  }

  // Simulate server-side sorting and pagination
  const sortedData = [...users].sort((a, b) => {
    if (tableSorting.length === 0) return 0

    const sort = tableSorting[0]
    const key = sort.id as keyof User

    if (a[key] < b[key]) return sort.desc ? 1 : -1
    if (a[key] > b[key]) return sort.desc ? -1 : 1
    return 0
  })

  // Handler for row clicks
  const handleRowClick = (data: User, index: number) => {
    console.log('Row clicked:', { data, index })
  }

  return (
    <SandboxLayout.Main className="flex justify-center items-center">
      <SandboxLayout.Content className="w-[900px] justify-center">
        <DataTable<User>
          columns={columns}
          data={sortedData}
          getRowId={row => row.email}
          size="compact"
          currentSorting={tableSorting}
          onSortingChange={handleSortingChange}
          pagination={{
            currentPage: 1,
            pageSize: 3,
            totalItems: users.length,
            goToPage: () => {}
          }}
          onRowClick={handleRowClick}
          enableRowSelection
          currentRowSelection={rowSelection}
          onRowSelectionChange={handleRowSelectionChange}
          enableExpanding
          currentExpanded={expanded}
          onExpandedChange={handleExpandedChange}
          renderSubComponent={renderSubComponent}
          getRowCanExpand={(row: Row<User>) => row.original.status === 'active'}
          getRowCanSelect={(row: Row<User>) => row.original.status === 'active'}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableDemo
