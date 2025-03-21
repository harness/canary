import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@harnessio/canary'
import { Table } from '@harnessio/ui/components'

import { getInitials, timeAgo } from '../../utils/utils'
import { UsersProps } from './interfaces'

interface PageProps {
  users: UsersProps[]
  onDelete: (user: UsersProps) => void
  onEdit: (user: UsersProps) => void
  onRemoveAdmin: (user: UsersProps) => void
  onResetPassword: (user: UsersProps) => void
  onSetAdmin: (user: UsersProps) => void
}

// fix the edit form dialog and mock data and corresponding props
export const UsersList = ({ users, onDelete, onEdit, onRemoveAdmin, onResetPassword, onSetAdmin }: PageProps) => {
  //TODO: migrate actions component
  const moreActionsTooltip = ({ user }: { user: UsersProps }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="xs">
            <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[180px] rounded-[10px] border border-gray-800 bg-primary-background py-2 shadow-sm"
          onCloseAutoFocus={event => event.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                return user.admin ? onRemoveAdmin(user) : onSetAdmin(user)
              }}
            >
              <DropdownMenuShortcut className="ml-0">
                <Icon name="trash" className="mr-2" />
              </DropdownMenuShortcut>
              {user.admin ? 'Remove Admin' : 'Set as Admin'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                onResetPassword(user)
              }}
            >
              <DropdownMenuShortcut className="ml-0">
                <Icon name="cog-6" className="mr-2" />
              </DropdownMenuShortcut>
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                onEdit(user)
              }}
            >
              <DropdownMenuShortcut className="ml-0">
                <Icon name="edit-pen" className="mr-2" />
              </DropdownMenuShortcut>
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 hover:text-red-400 focus:text-red-400"
              onSelect={() => {
                onDelete(user)
              }}
            >
              <DropdownMenuShortcut className="ml-0">
                <Icon name="trash" className="mr-2 text-red-400" />
              </DropdownMenuShortcut>
              Delete User
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head className="text-primary">Name</Table.Head>
          <Table.Head className="text-primary">Email</Table.Head>
          <Table.Head className="text-primary">Display Name</Table.Head>
          <Table.Head className="text-right text-primary">Date added</Table.Head>
          <Table.Head>
            <></>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users &&
          users.map(user => {
            return (
              <Table.Row key={user.uid}>
                {/* NAME */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center gap-4">
                    <Avatar size="10">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                      <AvatarFallback className="p-1 text-center text-xs">{getInitials(user.uid!, 2)}</AvatarFallback>
                    </Avatar>
                    <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                      {user.display_name}
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
                {/* EMAIL */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.email}
                    </Text>
                  </div>
                </Table.Cell>

                {/* displayName */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.display_name}
                    </Text>
                  </div>
                </Table.Cell>

                {/* TimeStamp */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center justify-end gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {timeAgo(user.created)}
                    </Text>
                  </div>
                </Table.Cell>

                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" /> */}
                    {moreActionsTooltip({ user })}
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Root>
  )
}
