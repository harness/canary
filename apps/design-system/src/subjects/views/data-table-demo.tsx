import { useState } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

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
  // Define columns for the data table
  const columns: ColumnDef<User>[] = [
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
      enableSorting: true
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
  ]

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3
  const totalItems = users.length

  // Slice data for current page (in a real app, this would be handled by the backend)
  // const paginatedData = users.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const paginatedData = users

  return (
    <SandboxLayout.Main className="flex justify-center items-center">
      <SandboxLayout.Content className="max-w-[600px] flex justify-center">
        <DataTable
          columns={columns}
          data={paginatedData}
          size="compact"
          enableSorting={true}
          defaultSorting={[{ id: 'name', desc: false }]}
          pagination={{
            currentPage,
            pageSize,
            totalItems,
            goToPage: setCurrentPage
          }}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableDemo
