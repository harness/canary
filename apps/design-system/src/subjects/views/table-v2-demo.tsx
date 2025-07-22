import { Table } from '@harnessio/ui/components'
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
      <SandboxLayout.Content className="max-w-[600px] justify-center items-center">
        <Table.Root size="compact">
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Last Login</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(user => (
              <Table.Row key={user.id}>
                <Table.Cell className="font-medium">{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>{user.status}</Table.Cell>
                <Table.Cell>{user.lastLogin}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default TableV2Demo
