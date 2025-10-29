import { useCallback, useMemo } from 'react'

import { Avatar, DropdownMenu, IconV2, MoreActionsTooltip, PaginationProps, Table } from '@/components'
import { useCustomDialogTrigger, useTranslation } from '@/context'
import { MembersProps } from '@/views'
import { getRolesData } from '@views/project/project-members/constants'

interface MembersListProps {
  members: MembersProps[]
  onDelete: (member: string) => void
  onEdit: (member: MembersProps) => void
  paginationProps?: PaginationProps
}

export const MembersList = ({ members, onDelete, onEdit, paginationProps }: MembersListProps) => {
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
    <Table.Root paginationProps={paginationProps}>
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
              <div className="gap-cn-xs flex items-center">
                <Avatar name={member.display_name} src={member.avatarUrl} rounded />
                <span className="text-cn-1 font-medium">{member.display_name}</span>
              </div>
            </Table.Cell>

            {/* EMAIL */}
            <Table.Cell className="text-cn-2 content-center">{member.email}</Table.Cell>

            {/* ROLE */}
            <Table.Cell className="w-1/5 content-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="gap-x-cn-2xs text-cn-2 hover:text-cn-1 flex items-center">
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
