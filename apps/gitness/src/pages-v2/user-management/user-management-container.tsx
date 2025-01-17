import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useAdminDeleteUserMutation,
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import {
  AdminDialog,
  DeleteUserDialog,
  DialogLabels,
  EditUserDialog,
  ResetPasswordDialog,
  UserManagementPage,
  UsersProps
} from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useAdminListUsersStore } from './stores/admin-list-store'

export const UserManagementPageContainer = () => {
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { setUsers, setTotalPages, setPage, page } = useAdminListUsersStore()
  const queryClient = useQueryClient()

  const [user, setUser] = useState<UsersProps>({})
  const [isDeleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [isAdminDialogOpen, setAdminDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)

  const handleDialogOpen = (user: UsersProps, dialogTypeLabel: string) => {
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
        setResetPasswordDialogOpen(true)
        break
      default:
        break
    }
    setUser(user)
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

  const { mutate: updateUser } = useAdminUpdateUserMutation(
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

  const { mutate: deleteUser } = useAdminDeleteUserMutation(
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

  const handleUpdatePassword = (userId: string, password: string) => {
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
        user={user}
        onClose={() => setDeleteUserDialogOpen(false)}
        isDeleting={false}
        handleDeleteUser={handleDeleteUser}
      />
      <EditUserDialog
        open={isEditUserDialogOpen}
        user={user}
        isSubmitting={false}
        onClose={() => setEditUserDialogOpen(false)}
        handleUpdateUser={handleUpdateUser}
      />
      <AdminDialog
        open={isAdminDialogOpen}
        user={user}
        onClose={() => setAdminDialogOpen(false)}
        isLoading={isUpdatingUserAdmin}
        updateUserAdmin={handleUpdateUserAdmin}
      />
      <ResetPasswordDialog
        open={isResetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}
        handleUpdatePassword={handleUpdatePassword}
        user={user}
      />
    </>
  )
}
