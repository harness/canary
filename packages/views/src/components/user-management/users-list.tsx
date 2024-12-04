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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@harnessio/canary'

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

// fix the edit form dialog and mock data and coressponding props
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
          className="bg-primary-background w-[180px] rounded-[10px] border border-gray-800 py-2 shadow-sm"
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
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary">Name</TableHead>
          <TableHead className="text-primary">Email</TableHead>
          <TableHead className="text-primary">Display Name</TableHead>
          <TableHead className="text-primary text-right">Date added</TableHead>
          <TableHead>
            <></>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users &&
          users.map(user => {
            return (
              <TableRow key={user.uid}>
                {/* NAME */}
                <TableCell className="my-6 content-center">
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
                          className="text-tertiary-background bg-tertiary-background/10 m-auto ml-2 h-5 rounded-full p-2 text-center text-xs font-normal"
                        >
                          Admin
                        </Badge>
                      )}
                    </Text>
                  </div>
                </TableCell>
                {/* EMAIL */}
                <TableCell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.email}
                    </Text>
                  </div>
                </TableCell>

                {/* displayName */}
                <TableCell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.display_name}
                    </Text>
                  </div>
                </TableCell>

                {/* TimeStamp */}
                <TableCell className="my-6 content-center">
                  <div className="flex items-center justify-end gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {timeAgo(user.created)}
                    </Text>
                  </div>
                </TableCell>

                <TableCell className="my-6 content-center">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" /> */}
                    {moreActionsTooltip({ user })}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
