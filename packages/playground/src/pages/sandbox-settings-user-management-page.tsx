import React, { useState, useReducer } from 'react'
import { Spacer, Text, ListActions, SearchBox, Button } from '@harnessio/canary'
import { SandboxLayout, SkeletonList, NoData } from '..'
import { mockUsersData } from '../data/mockUsersData'
import { UsersList } from '../components/user-management/users-list'
import { PlaygroundListSettings } from '../settings/list-settings'
import { PaginationComponent } from '../components/pagination'
import { useNavigate } from 'react-router-dom'
import {
  dialogStateReducer,
  initialDialogState
} from '../components/user-management/user-reducers/dialog-state-reducers'
import { FormUserEditDialog } from '../components/user-management/form-user-edit-dialog'
import { FormDeleteUserDialog } from '../components/user-management/form-user-delete-dialog'
import { FormRemoveAdminDialog } from '../components/user-management/form-admin-remove-dialog'
import { FormResetPasswordDialog } from '../components/user-management/form-user-reset-password'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

type UsersProps = {
  admin: boolean
  uid: string
  display_name?: string | undefined // Add a default value of undefined
  email: string
  created: number // Update the type to number
  updated?: number
  avatarUrl?: string
  blocked?: boolean
}

function SandboxSettingsUserManagementPage() {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState('data-loaded')
  const [dialogState, dispatch] = useReducer(dialogStateReducer, initialDialogState)

  const openDialog = (dialogType: 'delete' | 'edit' | 'removeAdmin' | 'resetPassword', user: UsersProps) => {
    dispatch({ type: 'OPEN_DIALOG', dialogType, user })
  }

  const closeDialog = (dialogType: 'delete' | 'edit' | 'removeAdmin' | 'resetPassword') => {
    dispatch({ type: 'CLOSE_DIALOG', dialogType })
  }

  // Delete user handler
  const handleDelete = () => {
    dispatch({ type: 'START_DELETING' })

    // Simulate an API call
    setTimeout(() => {
      dispatch({ type: 'DELETE_SUCCESS' })
      setTimeout(() => {
        closeDialog('delete')
        dispatch({ type: 'RESET_DELETE' })
      }, 2000)
    }, 2000)
  }

  //form edit submit
  const handleFormSave = () => {
    dispatch({ type: 'START_SUBMITTING' })

    setTimeout(() => {
      dispatch({ type: 'SUBMIT_SUCCESS' })
      setTimeout(() => {
        closeDialog('edit')
        dispatch({ type: 'RESET_SUBMIT' })
      }, 2000)
    }, 2000)
  }

  // Delete project handler
  const handleRemove = () => {
    dispatch({ type: 'START_REMOVING' })

    setTimeout(() => {
      dispatch({ type: 'REMOVE_SUCCESS' })
      setTimeout(() => {
        closeDialog('removeAdmin')
        dispatch({ type: 'RESET_REMOVE' })
      }, 2000)
    }, 2000)
  }

  // Reset password handler
  const handleReset = () => {
    dispatch({ type: 'START_RESETTING' })
    setTimeout(() => {
      dispatch({ type: 'RESET_PASSWORD_SUCCESS' })
      setTimeout(() => {
        closeDialog('resetPassword')
        dispatch({ type: 'RESET_PASSWORD_RESET' })
      }, 2000)
    }, 2000)
  }

  const renderUserListContent = () => {
    switch (loadState) {
      case 'loading':
        return <SkeletonList />
      case 'data-loaded':
        return (
          <>
            <UsersList
              onEdit={user => openDialog('edit', user)}
              onDelete={user => openDialog('delete', user)}
              onRemoveAdmin={user => openDialog('removeAdmin', user)}
              onResetPassword={user => openDialog('resetPassword', user)}
              users={mockUsersData as UsersProps[]}
            />
            {/* Delete Dialog */}
            {dialogState.isDialogDeleteOpen && (
              <FormDeleteUserDialog
                isDeleting={dialogState.isDeleting}
                deleteSuccess={dialogState.deleteSuccess}
                onDelete={handleDelete}
                user={dialogState.selectedUser!}
                onClose={() => {
                  closeDialog('delete')
                  dispatch({ type: 'RESET_DELETE' })
                }}
              />
            )}
            {/* Edit Dialog */}
            {dialogState.isDialogEditOpen && (
              <FormUserEditDialog
                isSubmitting={dialogState.isSubmitting}
                submitted={dialogState.submitted}
                user={dialogState.selectedUser!}
                onSave={handleFormSave}
                onClose={() => {
                  closeDialog('edit')
                  dispatch({ type: 'RESET_SUBMIT' })
                }}
              />
            )}
            {dialogState.isDialogRemoveAdminOpen && (
              <FormRemoveAdminDialog
                isRemoving={dialogState.isRemoving}
                removeSuccess={dialogState.removeSuccess}
                user={dialogState.selectedUser!}
                onRemove={handleRemove}
                onClose={() => {
                  closeDialog('removeAdmin')
                  dispatch({ type: 'RESET_REMOVE' })
                }}
              />
            )}
            {dialogState.isDialogResetPasswordOpen && (
              <FormResetPasswordDialog
                isResetting={dialogState.isResetting}
                resetSuccess={dialogState.resetSuccess}
                user={dialogState.selectedUser!}
                onReset={handleReset}
                onClose={() => {
                  closeDialog('resetPassword')
                  dispatch({ type: 'RESET_PASSWORD_RESET' })
                }}
              />
            )}
          </>
        )
      case 'no-search-matches':
        return (
          <>
            <Spacer size={10} />
            <NoData
              iconName="no-search-magnifying-glass"
              title="No search results"
              description={['Check your spelling and filter options,', 'or search for a different keyword.']}
              primaryButton={{ label: 'Clear search' }}
              secondaryButton={{ label: 'Clear filters' }}
            />
          </>
        )
    }
  }

  if (loadState === 'no-data') {
    return (
      //add this layout to target the content in the center of the page without header and subheader
      <SandboxLayout.Main hasLeftPanel>
        <SandboxLayout.Content maxWidth="3xl" className="h-screen">
          <NoData
            iconName="no-data-members"
            title="No Users yet"
            description={['Add your first team members by inviting them to join this project.']}
            primaryButton={{ label: 'Invite new members', to: '/sandbox/settings/user-mamagement/create-new-user' }}
          />
          <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  const handleInviteClick = () => {
    navigate('/sandbox/settings/user-mamagement/create-new-user')
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="3xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Users
        </Text>
        <Text size={5} weight={'medium'} color="tertiaryBackground">
          {loadState === 'data-loaded' || loadState === 'no-search-matches' ? ', 30 users' : ''}
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search Users" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="All Team Roles" items={filterOptions} />
            <ListActions.Dropdown title="Last added" items={sortOptions} />
            <Button variant="default" onClick={handleInviteClick}>
              Invite New Users
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderUserListContent()}
        <Spacer size={8} />
        {loadState === 'data-loaded' && (
          <PaginationComponent
            totalPages={10}
            currentPage={5}
            nextPage={() => {}}
            previousPage={() => {}}
            handleClick={() => {}}
          />
        )}
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsUserManagementPage }
