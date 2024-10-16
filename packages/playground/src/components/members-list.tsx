import React from 'react'
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge
} from '@harnessio/canary'
import { getInitials } from '../utils/utils'

interface MembersProps {
  display_name: string
  role: string
  email: string
  timestamp?: string
  avatarUrl?: string
}

interface PageProps {
  members: MembersProps[]
}

export const MembersList = ({ members }: PageProps) => {
  return (
    <Table variant="asStackedList" className="border-0">
      <TableHeader>
        <TableRow>
          <TableHead className="text-primary">Name</TableHead>
          <TableHead className="text-primary">Role</TableHead>
          <TableHead className="text-primary">Email</TableHead>
          {members[0]?.timestamp && <TableHead className="text-right text-primary">Date added</TableHead>}
          <TableHead>
            <></>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members &&
          members.map((member, index) => {
            return (
              <TableRow key={index}>
                {/* NAME */}
                <TableCell className="content-center my-6">
                  <div className="flex items-center gap-4">
                    <Avatar size="10">
                      {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                      <AvatarFallback className="text-xs p-1 text-center">
                        {getInitials(member.display_name, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                      {member.display_name}
                    </Text>
                  </div>
                </TableCell>
                {/* ROLE */}
                <TableCell className="content-center my-6">
                  <div className="flex gap-1.5 items-center">
                    <Text size={2} wrap="nowrap" truncate className="text-tertiary-background">
                      <Badge
                        variant="outline"
                        size="xs"
                        className="rounded-full font-normal text-xs p-2 h-5 text-tertiary-background text-center m-auto bg-tertiary-background/10">
                        {member.role}
                      </Badge>
                    </Text>
                  </div>
                </TableCell>
                {/* EMAIL */}
                <TableCell className="content-center my-6">
                  <div className="flex gap-1.5">
                    <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                      {member.email}
                    </Text>
                  </div>
                </TableCell>
                {/* DATE ADDED */}
                {member.timestamp && (
                  <TableCell className="content-center">
                    <div className="flex gap-1.5 items-center justify-end">
                      <Text wrap="nowrap" size={1} truncate className="text-tertiary-background text-right">
                        {member.timestamp}
                      </Text>
                    </div>
                  </TableCell>
                )}
                <TableCell className="content-center my-6">
                  <div className="flex gap-1.5 items-center justify-end">
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
