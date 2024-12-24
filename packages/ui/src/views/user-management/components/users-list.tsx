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
} from '@/components'
import { getInitials } from '@/utils/utils'

import { UsersProps } from '../types'

interface PageProps {
  users: UsersProps[]
}

// fix the edit form dialog and mock data and coressponding props
export const UsersList = ({ users }: PageProps) => {
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
            <DropdownMenuItem className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="trash" className="mr-2" />
              </DropdownMenuShortcut>
              {user.admin ? 'Remove Admin' : 'Set as Admin'}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="cog-6" className="mr-2" />
              </DropdownMenuShortcut>
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <DropdownMenuShortcut className="ml-0">
                <Icon name="edit-pen" className="mr-2" />
              </DropdownMenuShortcut>
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-400 hover:text-red-400 focus:text-red-400">
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
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role Binding</TableHead>
          {/* <TableHead className="text-right text-primary">Date added</TableHead> */}
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
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6 rounded-full p-0">
                      {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                      <AvatarFallback>{getInitials(user.uid!, 2)}</AvatarFallback>
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
                </TableCell>
                {/* EMAIL */}
                <TableCell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {user.email}
                    </Text>
                  </div>
                </TableCell>

                {/* @TODO: add roll binding data when available */}
                <TableCell className="my-6 content-center"></TableCell>

                <TableCell className="my-6 content-center">
                  <div className="flex items-center justify-end">{moreActionsTooltip({ user })}</div>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
