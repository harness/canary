import { Avatar, AvatarFallback, AvatarImage, Badge, Icon, Text } from '@harnessio/canary'
import { Table } from '@harnessio/ui/components'

import { getInitials } from '../utils/utils'

interface UsersProps {
  display_name: string
  role: string
  email: string
  timestamp?: string
  avatarUrl?: string
}

interface PageProps {
  users: UsersProps[]
}

export const UsersList = ({ users }: PageProps) => {
  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head className="text-primary">Name</Table.Head>
          <Table.Head className="text-primary">Role</Table.Head>
          <Table.Head className="text-primary">Email</Table.Head>
          <Table.Head className="text-right text-primary">Date added</Table.Head>
          <Table.Head>
            <></>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users &&
          users.map((user, index) => {
            return (
              <Table.Row key={index}>
                {/* NAME */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center gap-4">
                    <Avatar size="10">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                      <AvatarFallback className="p-1 text-center text-xs">
                        {getInitials(user.display_name, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                      {user.display_name}
                      {user.role === 'Admin' && (
                        <Badge
                          variant="outline"
                          size="xs"
                          className="m-auto ml-2 h-5 rounded-full bg-tertiary-background/10 p-2 text-center text-xs font-normal text-tertiary-background"
                        >
                          {user.role}
                        </Badge>
                      )}
                    </Text>
                  </div>
                </Table.Cell>
                {/* ROLE */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center gap-1.5">
                    <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                      {user.role}
                    </Text>
                  </div>
                </Table.Cell>
                {/* EMAIL */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.email}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center justify-end gap-1.5">
                    <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Root>
  )
}
