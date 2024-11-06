import React, { useState, useReducer } from 'react'
import { Spacer, Text, ListActions, SearchBox, Button } from '@harnessio/canary'
import { SandboxLayout, SkeletonList, NoData } from '..'
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
import { DialogActionType, DialogType } from '../components/user-management/interfaces'
import { UsersProps } from '../components/user-management/interfaces'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

function SandboxSettingsUserManagementPage({ userData, handleUpdateUser }: { userData: UsersProps[] | null }) {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState('data-loaded')
  const [dialogState, dispatch] = useReducer(dialogStateReducer, initialDialogState)

  const openDialog = (dialogType: DialogType, user: UsersProps) => {
    dispatch({ type: DialogActionType.OPEN_DIALOG, dialogType, user })
  }

  const closeDialog = (dialogType: DialogType) => {
    dispatch({ type: DialogActionType.CLOSE_DIALOG, dialogType })
  }

  // Handler for user deletion
  const handleDelete = () => {
    dispatch({ type: DialogActionType.START_DELETING })

    setTimeout(() => {
      dispatch({ type: DialogActionType.DELETE_SUCCESS })
      setTimeout(() => {
        closeDialog(DialogType.DELETE)
        dispatch({ type: DialogActionType.RESET_DELETE })
      }, 2000)
    }, 2000)
  }

  // Handler for form submission
  const handleFormSave = () => {
    dispatch({ type: DialogActionType.START_SUBMITTING })
    setTimeout(() => {
      dispatch({ type: DialogActionType.SUBMIT_SUCCESS })
      setTimeout(() => {
        closeDialog(DialogType.EDIT)
        dispatch({ type: DialogActionType.RESET_SUBMIT })
      }, 2000)
    }, 2000)
  }

  // Handler for admin removal
  const handleRemove = () => {
    dispatch({ type: DialogActionType.START_REMOVING })

    setTimeout(() => {
      dispatch({ type: DialogActionType.REMOVE_SUCCESS })
      setTimeout(() => {
        closeDialog(DialogType.REMOVE_ADMIN)
        dispatch({ type: DialogActionType.RESET_REMOVE })
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
              onEdit={user => openDialog(DialogType.EDIT, user)}
              onDelete={user => openDialog(DialogType.DELETE, user)}
              onRemoveAdmin={user => openDialog(DialogType.REMOVE_ADMIN, user)}
              onResetPassword={user => openDialog(DialogType.RESET_PASSWORD, user)}
              users={userData as UsersProps[]}
            />
            {/* Delete Dialog */}
            {dialogState.isDialogDeleteOpen && (
              <FormDeleteUserDialog
                isDeleting={dialogState.isDeleting}
                deleteSuccess={dialogState.deleteSuccess}
                onDelete={handleDelete}
                user={dialogState.selectedUser!}
                onClose={() => {
                  closeDialog(DialogType.DELETE)
                  dispatch({ type: DialogActionType.RESET_DELETE })
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
                  closeDialog(DialogType.EDIT)
                  dispatch({ type: DialogActionType.RESET_SUBMIT })
                }}
                handleUpdateUser={handleUpdateUser}
              />
            )}
            {dialogState.isDialogRemoveAdminOpen && (
              <FormRemoveAdminDialog
                isRemoving={dialogState.isRemoving}
                removeSuccess={dialogState.removeSuccess}
                user={dialogState.selectedUser!}
                onRemove={handleRemove}
                onClose={() => {
                  closeDialog(DialogType.REMOVE_ADMIN)
                  dispatch({ type: DialogActionType.RESET_REMOVE })
                }}
              />
            )}
            {dialogState.isDialogResetPasswordOpen && (
              <FormResetPasswordDialog
                user={dialogState.selectedUser!}
                onClose={() => {
                  closeDialog(DialogType.RESET_PASSWORD)
                  dispatch({ type: DialogActionType.RESET_PASSWORD_RESET })
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
        {loadState === 'data-loaded' && <PaginationComponent totalPages={10} currentPage={5} goToPage={() => {}} />}
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsUserManagementPage }
