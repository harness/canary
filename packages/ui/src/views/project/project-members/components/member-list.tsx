import { useMemo } from 'react'

import { Avatar, DropdownMenu, Icon, MoreActionsTooltip, Table } from '@/components'
import { MembersProps, TranslationStore } from '@/views'
import { getInitials } from '@utils/stringUtils'
import { getRolesData } from '@views/project/project-members/constants'

interface MembersListProps {
  members: MembersProps[]
  onDelete: (member: string) => void
  onEdit: (member: MembersProps) => void
  useTranslationStore: () => TranslationStore
}

export const MembersList = ({ members, onDelete, onEdit, useTranslationStore }: MembersListProps) => {
  const { t } = useTranslationStore()

  const roleOptions = useMemo(() => getRolesData(t), [t])

  const getRoleLabel = (role: string) => {
    return roleOptions.find(it => it.uid === role)?.label || ''
  }

  return (
    <Table.Root variant="asStackedList">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t('views:projectSettings.membersTable.user', 'User')}</Table.Head>
          <Table.Head>{t('views:projectSettings.membersTable.email', 'Email')}</Table.Head>
          <Table.Head>{t('views:projectSettings.membersTable.role', 'Role')}</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map(member => (
          <Table.Row key={member.uid}>
            {/* USER */}
            <Table.Cell className="content-center">
              <div className="flex items-center gap-2">
                <Avatar.Root>
                  {!!member.avatarUrl && <Avatar.Image src={member.avatarUrl} />}
                  <Avatar.Fallback>{getInitials(member.display_name)}</Avatar.Fallback>
                </Avatar.Root>
                <span className="font-medium text-foreground-8">{member.display_name}</span>
              </div>
            </Table.Cell>

            {/* EMAIL */}
            <Table.Cell className="content-center text-foreground-2">{member.email}</Table.Cell>

            {/* ROLE */}
            <Table.Cell className="w-1/5 content-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-x-1.5 text-foreground-2 hover:text-foreground-1">
                  {getRoleLabel(member.role)}
                  <Icon className="chevron-down text-icons-7" name="chevron-fill-down" size={6} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start" className="w-[300px]">
                  {roleOptions.map(role => (
                    <DropdownMenu.Item
                      key={role.uid}
                      className="flex-col items-start gap-y-1.5 px-3 py-2"
                      onClick={() => onEdit({ ...member, role: role.uid })}
                    >
                      <span className="leading-none">{role.label}</span>
                      <span className="leading-tight text-foreground-4">{role.description}</span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Cell>

            <Table.Cell className="text-right">
              <MoreActionsTooltip
                isInTable
                actions={[
                  {
                    isDanger: true,
                    title: t('views:projectSettings.removeMember', 'Remove member'),
                    onClick: () => onDelete(member.uid)
                  }
                ]}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
