/**
 * @deprecated
 */

import { upperFirst } from 'lodash-es'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text
} from '@harnessio/canary'
import { Table } from '@harnessio/ui/components'

import { getInitials } from '../../utils/utils'
import { MembersProps } from './interfaces'
import { MoreActionsDropdown } from './more-actions-dropdown'
import { transformValue } from './utils'

interface PageProps {
  members: MembersProps[]
  onDelete: (member: MembersProps) => void
  onEdit: (member: MembersProps) => void
}

export const MembersList = ({ members, onDelete, onEdit }: PageProps) => {
  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head className="text-primary">Name</Table.Head>
          <Table.Head className="text-primary">Email</Table.Head>
          <Table.Head className="text-primary">Role</Table.Head>
          <Table.Head>
            <></>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map(member => (
          <Table.Row key={member.uid}>
            {/* NAME */}
            <Table.Cell className="my-6 content-center">
              <div className="flex items-center gap-4">
                <Avatar size="10">
                  {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                  <AvatarFallback className="p-1 text-center text-xs">
                    {getInitials(member.display_name, 2)}
                  </AvatarFallback>
                </Avatar>
                <Text size={2} weight="medium" wrap="nowrap" truncate className="text-primary">
                  {member.display_name}
                </Text>
              </div>
            </Table.Cell>
            {/* EMAIL */}
            <Table.Cell className="my-6 content-center">
              <div className="flex gap-1.5">
                <Text wrap="nowrap" size={1} truncate className="text-tertiary-background">
                  {member.email}
                </Text>
              </div>
            </Table.Cell>
            {/* ROLE */}
            <Table.Cell className="my-6 content-center">
              <Select
                value={member.role}
                onValueChange={newRole => onEdit({ ...member, role: transformValue(newRole) })}
              >
                <SelectTrigger className="w-[150px] justify-start space-x-2 border-0" iconClassName="flex-shrink-0">
                  <SelectValue className="flex-1 grow-0 basis-[70%]" placeholder="Select Role">
                    {/* //the data from api call is lowerCase */}
                    {upperFirst(member.role)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[300px]">
                  <SelectItem value="Owner">
                    <Text className="inline-block w-full text-left">Owner</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">
                      Admin-level access to all resources.
                    </Text>
                  </SelectItem>
                  <SelectItem value="Contributor">
                    <Text className="inline-block w-full text-left">Contributor</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">
                      Can view, comment, and edit resources.
                    </Text>
                  </SelectItem>
                  <SelectItem value="Reader">
                    <Text className="inline-block w-full text-left">Reader</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">Can view and comment.</Text>
                  </SelectItem>
                  <SelectItem value="Executor">
                    <Text className="inline-block w-full text-left">Executor</Text>
                    <Text className="mt-1.5 inline-block w-full text-muted-foreground">
                      Can view but cannot make changes or leave comments.
                    </Text>
                  </SelectItem>
                </SelectContent>
              </Select>
            </Table.Cell>
            <Table.Cell className="my-6 content-center">
              <div className="flex items-center justify-end gap-1.5">
                <MoreActionsDropdown member={member} onDelete={onDelete} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
