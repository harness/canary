import { TableV2 } from '@harnessio/ui/components'
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

export const TableV2Demo: React.FC = () => {
  return (
    <SandboxLayout.Main className="justify-center items-center">
      <SandboxLayout.Content className="max-w-[1000px] justify-center items-center">
        <TableV2.Root variant="relaxed">
          <TableV2.Caption>A list of users and their details</TableV2.Caption>
          <TableV2.Header>
            <TableV2.Row>
              <TableV2.Head>Name</TableV2.Head>
              <TableV2.Head>Email</TableV2.Head>
              <TableV2.Head>Role</TableV2.Head>
              <TableV2.Head>Status</TableV2.Head>
              <TableV2.Head>Last Login</TableV2.Head>
            </TableV2.Row>
          </TableV2.Header>
          <TableV2.Body hasHighlightOnHover>
            {users.map(user => (
              <TableV2.Row key={user.id}>
                <TableV2.Cell className="font-medium">{user.name}</TableV2.Cell>
                <TableV2.Cell>{user.email}</TableV2.Cell>
                <TableV2.Cell>{user.role}</TableV2.Cell>
                <TableV2.Cell>{user.status}</TableV2.Cell>
                <TableV2.Cell>{user.lastLogin}</TableV2.Cell>
              </TableV2.Row>
            ))}
          </TableV2.Body>
        </TableV2.Root>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default TableV2Demo
