import { useMemo } from 'react'

import {
  Avatar,
  DropdownMenu,
  Icon,
  MoreActionsTooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components'
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
    <Table variant="asStackedList">
      <TableHeader>
        <TableRow>
          <TableHead>{t('views:projectSettings.membersTable.user', 'User')}</TableHead>
          <TableHead>{t('views:projectSettings.membersTable.email', 'Email')}</TableHead>
          <TableHead>{t('views:projectSettings.membersTable.role', 'Role')}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <TableRow key={member.uid}>
            {/* USER */}
            <TableCell className="content-center">
              <div className="flex items-center gap-2">
                <Avatar.Root>
                  {!!member.avatarUrl && <Avatar.Image src={member.avatarUrl} />}
                  <Avatar.Fallback>{getInitials(member.display_name)}</Avatar.Fallback>
                </Avatar.Root>
                <span className="font-medium text-foreground-8">{member.display_name}</span>
              </div>
            </TableCell>

            {/* EMAIL */}
            <TableCell className="content-center text-foreground-2">{member.email}</TableCell>

            {/* ROLE */}
            <TableCell className="w-1/5 content-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-x-1.5 text-foreground-2 hover:text-foreground-1">
                  {getRoleLabel(member.role)}
                  <Icon className="chevron-down text-icons-7" name="chevron-fill-down" size={6} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  align="start"
                  className="w-[300px]"
                  onCloseAutoFocus={event => event.preventDefault()}
                >
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
            </TableCell>

            <TableCell className="text-right">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
