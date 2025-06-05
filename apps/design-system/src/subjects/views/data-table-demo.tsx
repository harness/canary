import { useState } from 'react'

import { ColumnDef, DataTable, StatusBadge } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

type User = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Developer',
    status: 'active'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Designer',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'Product Manager',
    status: 'pending'
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Developer',
    status: 'active'
  }
]

// Column definitions
// Each column definition has:
// - header: What appears in the column header
// - accessorKey: Which property from the data object to display
// - cell (optional): Custom rendering function for the cell content
const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    accessorKey: 'name'
  },

  // Basic columns - just display the raw property values
  {
    header: 'Email',
    accessorKey: 'email'
    // No cell function means it will display the raw value
  },
  {
    header: 'Role',
    accessorKey: 'role'
  },

  // Advanced column - custom rendering for status badges
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (value: unknown, _row: User) => {
      const status = value as 'active' | 'inactive' | 'pending'

      return (
        <StatusBadge
          variant="secondary"
          theme={status === 'active' ? 'success' : status === 'inactive' ? 'danger' : 'warning'}
        >
          {status}
        </StatusBadge>
      )
    }
  }
]

export const DataTableDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 2 // Small for demo purposes

  // Total number of items (all users)
  const totalItems = users.length

  // Calculate which users to display based on pagination
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <SandboxLayout.Main className="justify-center items-center">
      <SandboxLayout.Content className="max-w-[600px]">
        <DataTable<User>
          data={paginatedUsers}
          columns={columns}
          variant="default"
          pagination={{
            totalItems,
            pageSize,
            currentPage,
            goToPage: page => setCurrentPage(page)
          }}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default DataTableDemo
