import { Avatar, Badge, MoreActionsTooltip, Table, Text } from '@/components'
import { getInitials } from '@/utils/utils'

import { DialogLabels, UsersProps } from '../types'

interface PageProps {
  users: UsersProps[]
  handleDialogOpen: (user: UsersProps | null, dialogLabel: string) => void
}

export const UsersList = ({ users, handleDialogOpen }: PageProps) => {
  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head>User</Table.Head>
          <Table.Head>Display Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users &&
          users.map(user => {
            return (
              <Table.Row key={user.uid}>
                {/* NAME */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center gap-2">
                    <Avatar.Root>
                      {!!user?.avatarUrl && <Avatar.Image src={user.avatarUrl} />}
                      <Avatar.Fallback>{getInitials(user.uid!)}</Avatar.Fallback>
                    </Avatar.Root>
                    <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                      {user.uid}
                      {user.admin && (
                        <Badge
                          variant="outline"
                          size="xs"
                          className="m-auto ml-2 h-5 rounded-full bg-tertiary-background/10 p-2 text-center text-xs font-normal text-tertiary-background"
                        >
                          Admin
                        </Badge>
                      )}
                    </Text>
                  </div>
                </Table.Cell>

                {/* DISPLAY NAME */}
                <Table.Cell className="my-6 content-center">
                  <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                    {user.display_name}
                  </Text>
                </Table.Cell>

                {/* EMAIL */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.email}
                    </Text>
                  </div>
                </Table.Cell>

                <Table.Cell className="text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        title: user.admin ? 'Remove Admin' : 'Set as Admin',
                        onClick: () => handleDialogOpen(user, DialogLabels.TOGGLE_ADMIN)
                      },
                      {
                        title: 'Reset Password',
                        onClick: () => handleDialogOpen(user, DialogLabels.RESET_PASSWORD)
                      },
                      {
                        title: 'Edit User',
                        onClick: () => handleDialogOpen(user, DialogLabels.EDIT_USER)
                      },
                      {
                        isDanger: true,
                        title: 'Delete User',
                        onClick: () => handleDialogOpen(user, DialogLabels.DELETE_USER)
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Root>
  )
}
