import { useCallback, useMemo } from 'react'

import { Avatar, DropdownMenu, IconV2, MoreActionsTooltip, Table } from '@/components'
import { useCustomDialogTrigger, useTranslation } from '@/context'
import { MembersProps } from '@/views'
import { getRolesData } from '@views/project/project-members/constants'

interface MembersListProps {
  members: MembersProps[]
  onDelete: (member: string) => void
  onEdit: (member: MembersProps) => void
}

export const MembersList = ({ members, onDelete, onEdit }: MembersListProps) => {
  const { t } = useTranslation()

  const roleOptions = useMemo(() => getRolesData(t), [t])

  const getRoleLabel = (role: string) => {
    return roleOptions.find(it => it.uid === role)?.label || ''
  }

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleDeleteMember = useCallback(
    (memberId: string) => {
      registerTrigger()
      onDelete(memberId)
    },
    [onDelete, registerTrigger]
  )

  return (
    <Table.Root>
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
                <Avatar name={member.display_name} src={member.avatarUrl} rounded />
                <span className="font-medium text-cn-1">{member.display_name}</span>
              </div>
            </Table.Cell>

            {/* EMAIL */}
            <Table.Cell className="content-center text-cn-2">{member.email}</Table.Cell>

            {/* ROLE */}
            <Table.Cell className="w-1/5 content-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-x-1.5 text-cn-2 hover:text-cn-1">
                  {getRoleLabel(member.role)}
                  <IconV2 className="chevron-down text-cn-2" name="nav-solid-arrow-down" size="2xs" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start">
                  {roleOptions.map(role => (
                    <DropdownMenu.Item
                      title={role.label}
                      description={role.description}
                      key={role.uid}
                      onClick={() => onEdit({ ...member, role: role.uid })}
                    />
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Cell>

            <Table.Cell className="text-right">
              <MoreActionsTooltip
                ref={triggerRef}
                isInTable
                actions={[
                  {
                    isDanger: true,
                    title: t('views:projectSettings.removeMember', 'Remove member'),
                    onClick: () => handleDeleteMember(member.uid)
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
