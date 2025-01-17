import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useAdminCreateUserMutation,
  useAdminDeleteUserMutation,
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import {
  AdminDialog,
  CreateUserDialog,
  DeleteUserDialog,
  DialogLabels,
  EditUserDialog,
  ResetPasswordDialog,
  UserManagementPage,
  UsersProps
} from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { generateAlphaNumericHash } from '../pull-request/pull-request-utils'
import { useAdminListUsersStore } from './stores/admin-list-store'

export const UserManagementPageContainer = () => {
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { setUsers, setTotalPages, setPage, page, password, setUser, setPassword, setGeteneratePassword } =
    useAdminListUsersStore()
  const queryClient = useQueryClient()

  const [isDeleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [isAdminDialogOpen, setAdminDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false)

  const handleDialogOpen = (user: UsersProps | null, dialogTypeLabel: string) => {
    if (user) setUser(user)

    switch (dialogTypeLabel) {
      case DialogLabels.DELETE_USER:
        setDeleteUserDialogOpen(true)
        break
      case DialogLabels.EDIT_USER:
        setEditUserDialogOpen(true)
        break
      case DialogLabels.TOGGLE_ADMIN:
        setAdminDialogOpen(true)
        break
      case DialogLabels.RESET_PASSWORD:
        setGeteneratePassword(false)
        setPassword(generateAlphaNumericHash(10))
        setResetPasswordDialogOpen(true)
        break
      case DialogLabels.CREATE_USER:
        setPassword(generateAlphaNumericHash(10))
        setCreateUserDialogOpen(true)
        setGeteneratePassword(true)
        break
      default:
        break
    }
  }

  const { data: { body: userData, headers } = {} } = useAdminListUsersQuery({
    queryParams: {
      page: queryPage
    }
  })

  useEffect(() => {
    if (userData) {
      setUsers(userData)
    }
    if (headers) {
      setTotalPages(headers)
    }
  }, [userData, setUsers, setTotalPages, headers])

  useEffect(() => {
    setQueryPage(page)
  }, [queryPage, page, setPage])

  const { mutate: updateUser, isLoading: isUpdatingUser } = useAdminUpdateUserMutation(
    {},
    {
      onSuccess: () => {
        setEditUserDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutate: deleteUser, isLoading: isDeletingUser } = useAdminDeleteUserMutation(
    {},
    {
      onSuccess: () => {
        setDeleteUserDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutate: updateUserAdmin, isLoading: isUpdatingUserAdmin } = useUpdateUserAdminMutation(
    {},
    {
      onSuccess: () => {
        setAdminDialogOpen(false)
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const {
    mutate: createUser,
    isLoading: isCreatingUser,
    error: createUserError
  } = useAdminCreateUserMutation(
    {},
    {
      onSuccess: () => {
        setCreateUserDialogOpen(false)
        setResetPasswordDialogOpen(true)
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const handleCreateUser = (data: { uid: string; email: string; display_name: string }) => {
    createUser({
      body: {
        uid: data.uid,
        email: data.email,
        display_name: data.display_name,
        password: password ?? ''
      }
    })
  }

  const handleUpdateUser = (data: { email: string; displayName: string; userID: string }) => {
    updateUser({
      user_uid: data.userID,
      body: {
        email: data.email,
        display_name: data.displayName
      }
    })
  }

  const handleDeleteUser = (userUid: string) => {
    deleteUser({
      user_uid: userUid
    })
  }

  const handleUpdateUserAdmin = (userUid: string, isAdmin: boolean) => {
    updateUserAdmin({
      user_uid: userUid,
      body: {
        admin: isAdmin
      }
    })
  }

  const handleUpdatePassword = (userId: string) => {
    updateUser({
      user_uid: userId,
      body: {
        password: password
      }
    })
  }

  return (
    <>
      <UserManagementPage
        useAdminListUsersStore={useAdminListUsersStore}
        useTranslationStore={useTranslationStore}
        handleDialogOpen={handleDialogOpen}
      />

      <DeleteUserDialog
        open={isDeleteUserDialogOpen}
        useAdminListUsersStore={useAdminListUsersStore}
        onClose={() => setDeleteUserDialogOpen(false)}
        isDeleting={isDeletingUser}
        handleDeleteUser={handleDeleteUser}
      />
      <EditUserDialog
        open={isEditUserDialogOpen}
        useAdminListUsersStore={useAdminListUsersStore}
        isSubmitting={isUpdatingUser}
        onClose={() => setEditUserDialogOpen(false)}
        handleUpdateUser={handleUpdateUser}
      />
      <AdminDialog
        open={isAdminDialogOpen}
        useAdminListUsersStore={useAdminListUsersStore}
        onClose={() => setAdminDialogOpen(false)}
        isLoading={isUpdatingUserAdmin}
        updateUserAdmin={handleUpdateUserAdmin}
      />
      <ResetPasswordDialog
        open={isResetPasswordDialogOpen}
        useAdminListUsersStore={useAdminListUsersStore}
        onClose={() => setResetPasswordDialogOpen(false)}
        handleUpdatePassword={handleUpdatePassword}
      />
      <CreateUserDialog
        open={isCreateUserDialogOpen}
        onClose={() => setCreateUserDialogOpen(false)}
        isLoading={isCreatingUser}
        apiError={createUserError?.message?.toString() ?? ''}
        handleCreateUser={handleCreateUser}
      />
    </>
  )
}
