import { useMemo, useState } from 'react'

import type { ColumnDef, ExpandedState, OnChangeFn, Row, RowSelectionState, SortingState } from '@tanstack/react-table'

import { DataTable, StatusBadge } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

// Sample data types
type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
}

// Sample data
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2025-06-01'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Developer',
    status: 'active',
    lastLogin: '2025-06-02'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Designer',
    status: 'inactive',
    lastLogin: '2025-05-28'
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'Product Manager',
    status: 'pending',
    lastLogin: '2025-06-03'
  },
  {
    id: '5',
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

  // Log selection changes
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = updaterOrValue => {
    const newSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue
    console.log('Row selection changed:', newSelection)
    setRowSelection(newSelection)
  }

  // Handle expanded state changes
  const handleExpandedChange: OnChangeFn<ExpandedState> = updaterOrValue => {
    const newExpanded = typeof updaterOrValue === 'function' ? updaterOrValue(expanded) : updaterOrValue
    console.log('Expanded state changed:', newExpanded)
    setExpanded(newExpanded)
  }

  // Demo fn to detrmine if a row can be expanded
  // Only allows rows with 'active' status to be expanded
  const getRowCanExpand = (row: Row<User>) => {
    const user = row.original
    return user.status === 'active'
  }

  // Render expanded row content
  const renderSubComponent = ({ row }: { row: Row<User> }) => {
    const user = row.original
    return (
      <div>
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

  // Sorting state for server-side sorting
  const [tableSorting, setTableSorting] = useState<SortingState>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3
  const totalItems = users.length

  // This function would typically make an API call to fetch sorted data
  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    // Handle both direct values and updater functions
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(tableSorting) : updaterOrValue

    console.log('Server-side sorting requested:', newSorting)
    setTableSorting(newSorting)

    // In a real app, you would fetch data from the server with the new sorting parameters
    // For this demo, we'll just sort the data client-side to simulate server-side sorting
    setCurrentPage(1) // Reset to first page when sorting changes
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

  // Slice data for current page (in a real app, this would be handled by the backend)
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Handler for row clicks
  const handleRowClick = (data: User, index: number) => {
    console.log('Row clicked:', { data, index })
  }

  return (
    <SandboxLayout.Main className="flex justify-center items-center">
      <SandboxLayout.Content className="w-[600px] flex justify-center">
        <DataTable
          columns={columns}
          data={paginatedData}
          size="default"
          currentSorting={tableSorting}
          onSortingChange={handleSortingChange}
          pagination={{
            currentPage,
            pageSize,
            totalItems,
            goToPage: setCurrentPage
          }}
          onRowClick={handleRowClick}
          enableRowSelection={true}
          currentRowSelection={rowSelection}
          onRowSelectionChange={handleRowSelectionChange}
          enableExpanding={true}
          currentExpanded={expanded}
          onExpandedChange={handleExpandedChange}
          renderSubComponent={renderSubComponent}
          getRowCanExpand={getRowCanExpand}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableDemo
