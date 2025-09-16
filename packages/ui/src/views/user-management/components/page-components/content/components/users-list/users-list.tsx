import { useCallback } from 'react'

import { Avatar, MoreActionsTooltip, Skeleton, StatusBadge, Table, useCustomDialogTrigger } from '@/components'
import { DialogLabels } from '@/views/user-management/components/dialogs'
import { useDialogData } from '@/views/user-management/components/dialogs/hooks/use-dialog-data'
import { ErrorState } from '@/views/user-management/components/page-components/content/components/users-list/components/error-state'
import { NoSearchResults } from '@/views/user-management/components/page-components/content/components/users-list/components/no-search-results'
import { useSearch } from '@/views/user-management/providers/search-provider'
import { useStates } from '@/views/user-management/providers/state-provider/hooks/use-states'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { UsersProps } from '@views/user-management/types'

export const UsersList = () => {
  const { useAdminListUsersStore } = useUserManagementStore()

  const { users } = useAdminListUsersStore()
  const { searchQuery } = useSearch()
  const { handleDialogOpen } = useDialogData()

  const { loadingStates, errorStates } = useStates()
  const { isFetchingUsers } = loadingStates
  const { fetchUsersError } = errorStates

  const { triggerRef, registerTrigger } = useCustomDialogTrigger()
  const handleToggleDialog = useCallback(
    (user: UsersProps | null, dialogType: DialogLabels) => {
      registerTrigger()
      handleDialogOpen(user, dialogType)
    },
    [handleDialogOpen, registerTrigger]
  )

  if (isFetchingUsers) {
    return <Skeleton.List />
  }

  if (fetchUsersError) {
    return <ErrorState />
  }

  // here should be additional check for users.length === 0,
  // but until backend is not ready I leave only searchQuery to make it possible to see how this component works
  // TODO: add additional check for users.length === 0 when backend will be ready
  if (searchQuery) {
    return <NoSearchResults />
  }

  return (
    <Table.Root disableHighlightOnHover>
      <Table.Header className="h-[46px]">
        <Table.Row className="pointer-events-none">
          <Table.Head className="w-[346px]">User</Table.Head>
          <Table.Head className="w-[346px]">Email</Table.Head>
          <Table.Head className="w-[346px]">Role binding</Table.Head>
          <Table.Head />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users &&
          users.map((user: UsersProps) => {
            return (
              <Table.Row key={user.uid} className="h-[48px]">
                {/* NAME */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex items-center gap-2">
                    <Avatar name={user.uid} src={user.avatarUrl} rounded />
                    <span className="truncate whitespace-nowrap text-sm font-medium text-cn-1">{user.uid}</span>
                  </div>
                </Table.Cell>

                {/* EMAIL */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <span className="truncate whitespace-nowrap text-sm text-cn-3">{user.email}</span>
                  </div>
                </Table.Cell>

                {/* ROLE BINDING */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <StatusBadge variant="outline" size="sm" theme={user.admin ? 'merged' : 'danger'}>
                      {user.admin ? 'Admin' : 'User'}
                    </StatusBadge>
                  </div>
                </Table.Cell>

                <Table.Cell className="text-right">
                  <MoreActionsTooltip
                    ref={triggerRef}
                    isInTable
                    actions={[
                      {
                        title: user.admin ? 'Remove admin' : 'Set as Admin',
                        onClick: () => handleToggleDialog(user, DialogLabels.TOGGLE_ADMIN)
                      },
                      {
                        title: 'Reset password',
                        onClick: () => handleToggleDialog(user, DialogLabels.RESET_PASSWORD)
                      },
                      {
                        title: 'Edit user',
                        onClick: () => handleToggleDialog(user, DialogLabels.EDIT_USER)
                      },
                      {
                        isDanger: true,
                        title: 'Delete user',
                        onClick: () => handleToggleDialog(user, DialogLabels.DELETE_USER)
                      }
                    ]}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
      </Table.Body>
    </Table.Root>
  )
}
