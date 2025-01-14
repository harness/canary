import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  MoreActionsTooltip,
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
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Email</TableHead>
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
                </TableCell>

                {/* DISPLAY NAME */}
                <TableCell className="my-6 content-center">
                  <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                    {user.display_name}
                  </Text>
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

                <TableCell className="text-right">
                  <MoreActionsTooltip
                    actions={[
                      {
                        title: user.admin ? 'Remove Admin' : 'Set as Admin',
                        // TODO: add onClick
                        onClick: () => {}
                      },
                      {
                        title: 'Reset Password',
                        // TODO: add onClick
                        onClick: () => {}
                      },
                      {
                        title: 'Edit User',
                        // TODO: add onClick
                        onClick: () => {}
                      },
                      {
                        isDanger: true,
                        title: 'Delete User',
                        // TODO: add onClick
                        onClick: () => {}
                      }
                    ]}
                  />
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
