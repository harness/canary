import { Avatar, Badge, MoreActionsTooltip, SkeletonList, Table } from '@/components'
import { DialogLabels } from '@/views/user-management/components/dialogs'
import { useDialogData } from '@/views/user-management/components/dialogs/hooks/use-dialog-data'
import { ErrorState } from '@/views/user-management/components/page-components/content/components/users-list/components/error-state'
import { NoSearchResults } from '@/views/user-management/components/page-components/content/components/users-list/components/no-search-results'
import { useSearch } from '@/views/user-management/providers/search-provider'
import { useStates } from '@/views/user-management/providers/state-provider/hooks/use-states'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { getInitials } from '@utils/stringUtils'
import { UsersProps } from '@views/user-management/types'

export const UsersList = () => {
  const { useAdminListUsersStore } = useUserManagementStore()

  const { users } = useAdminListUsersStore()
  const { searchQuery } = useSearch()
  const { handleDialogOpen } = useDialogData()

  const { loadingStates, errorStates } = useStates()
  const { isFetchingUsers } = loadingStates
  const { fetchUsersError } = errorStates

  if (isFetchingUsers) {
    return <SkeletonList />
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
    <Table.Root variant="asStackedList">
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
                    <Avatar.Root className="size-6 rounded-full p-0">
                      {user.avatarUrl && <Avatar.Image src={user.avatarUrl} />}
                      <Avatar.Fallback>{getInitials(user.uid!, 2)}</Avatar.Fallback>
                    </Avatar.Root>
                    <span className="truncate whitespace-nowrap text-sm font-medium text-foreground-8">{user.uid}</span>
                  </div>
                </Table.Cell>

                {/* EMAIL */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <span className="truncate whitespace-nowrap text-sm text-foreground-3">{user.email}</span>
                  </div>
                </Table.Cell>

                {/* ROLE BINDING */}
                <Table.Cell className="my-6 content-center">
                  <div className="flex gap-1.5">
                    <Badge disableHover variant="outline" size="sm" theme={user.admin ? 'emphasis' : 'destructive'}>
                      {user.admin ? 'Admin' : 'User'}
                    </Badge>
                  </div>
                </Table.Cell>

                <Table.Cell className="text-right">
                  <MoreActionsTooltip
                    isInTable
                    actions={[
                      {
                        title: user.admin ? 'Remove admin' : 'Set as Admin',
                        onClick: () => handleDialogOpen(user, DialogLabels.TOGGLE_ADMIN)
                      },
                      {
                        title: 'Reset password',
                        onClick: () => handleDialogOpen(user, DialogLabels.RESET_PASSWORD)
                      },
                      {
                        title: 'Edit user',
                        onClick: () => handleDialogOpen(user, DialogLabels.EDIT_USER)
                      },
                      {
                        isDanger: true,
                        title: 'Delete user',
                        onClick: () => handleDialogOpen(user, DialogLabels.DELETE_USER)
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
