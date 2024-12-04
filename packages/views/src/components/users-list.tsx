import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@harnessio/canary'

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
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary">Name</TableHead>
          <TableHead className="text-primary">Role</TableHead>
          <TableHead className="text-primary">Email</TableHead>
          <TableHead className="text-primary text-right">Date added</TableHead>
          <TableHead>
            <></>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users &&
          users.map((user, index) => {
            return (
              <TableRow key={index}>
                {/* NAME */}
                <TableCell className="my-6 content-center">
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
                          className="text-tertiary-background bg-tertiary-background/10 m-auto ml-2 h-5 rounded-full p-2 text-center text-xs font-normal"
                        >
                          {user.role}
                        </Badge>
                      )}
                    </Text>
                  </div>
                </TableCell>
                {/* ROLE */}
                <TableCell className="my-6 content-center">
                  <div className="flex items-center gap-1.5">
                    <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                      {user.role}
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
                <TableCell className="my-6 content-center">
                  <div className="flex items-center justify-end gap-1.5">
                    <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
