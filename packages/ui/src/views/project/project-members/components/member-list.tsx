import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  MoreActionsTooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text
} from '@/components'
import { getInitials } from '@utils/stringUtils'
import { upperFirst } from 'lodash-es'

import { MembersProps } from '../types'

interface PageProps {
  members: MembersProps[]
  onDelete: (member: MembersProps) => void
  onEdit: (member: MembersProps) => void
}

export const MembersList = ({ members, onDelete, onEdit }: PageProps) => {
  return (
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary">User</TableHead>
          <TableHead className="text-primary">Email</TableHead>
          <TableHead className="text-primary">Role</TableHead>
          <TableHead>
            <></> {/* For 3-dot menu */}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <TableRow key={member.uid}>
            {/* USER */}
            <TableCell className="my-6 content-center">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-tertiary-background bg-cover">
                  <Avatar className="size-6 rounded-full p-0">
                    {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                    <AvatarFallback>
                      <Text size={1} color="tertiaryBackground">
                        {getInitials(member.display_name, 2)}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Text size={1} weight="medium" wrap="nowrap" truncate className="text-primary">
                  {member.display_name}
                </Text>
              </div>
            </TableCell>
            {/* EMAIL */}
            <TableCell className="my-6 content-center">
              <div className="flex gap-1.5">
                <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                  {member.email}
                </Text>
              </div>
            </TableCell>
            {/* ROLE */}
            <TableCell className="my-6 content-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-x-1.5">
                  {upperFirst(member.role)}
                  <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px]">
                  <DropdownMenuItem
                    className="flex flex-col"
                    key="owner"
                    onClick={() => onEdit({ ...member, role: 'space_owner' })}
                  >
                    <Text className="inline-block w-full text-left">Owner</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">
                      Admin-level access to all resources.
                    </Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex flex-col"
                    key="contributor"
                    onClick={() => onEdit({ ...member, role: 'contributor' })}
                  >
                    <Text className="inline-block w-full text-left">Contributor</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">
                      Can view, comment, and edit resources.
                    </Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex flex-col"
                    key="reader"
                    onClick={() => onEdit({ ...member, role: 'reader' })}
                  >
                    <Text className="inline-block w-full text-left">Reader</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">Can view and comment.</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex flex-col"
                    key="executor"
                    onClick={() => onEdit({ ...member, role: 'executor' })}
                  >
                    <Text className="inline-block w-full text-left">Executor</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">
                      Can view but cannot make changes or leave comments.
                    </Text>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell className="text-right">
              <MoreActionsTooltip
                actions={[
                  {
                    isDanger: true,
                    title: 'Remove member',
                    onClick: () => onDelete(member)
                  }
                ]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
