import { useEffect } from 'react'

// import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  // useAdminDeleteUserMutation,
  useAdminListUsersQuery
  // useAdminUpdateUserMutation,
  // useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import { UserManagementPage } from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useAdminListUsersStore } from './stores/admin-list-store'

export const UserManagementPageContainer = () => {
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { setUsers, setTotalPages, setPage, page } = useAdminListUsersStore()
  // const queryClient = useQueryClient()
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

  // @TODO: add following mutations and callbacks back once functionality is added in the views page

  // const { mutateAsync: updateUser } = useAdminUpdateUserMutation(
  //   {},
  //   {
  //     onError: error => {
  //       console.error(error)
  //     }
  //   }
  // )

  // const { mutateAsync: deleteUser } = useAdminDeleteUserMutation(
  //   {},
  //   {
  //     onError: error => {
  //       console.error(error)
  //     }
  //   }
  // )

  // const { mutateAsync: updateUserAdmin } = useUpdateUserAdminMutation(
  //   {},
  //   {
  //     onError: error => {
  //       console.error(error)
  //     }
  //   }
  // )

  // const handleUpdateUser = async (data: { email: string; displayName: string; userID: string }) => {
  //   await updateUser({
  //     user_uid: data.userID,
  //     body: {
  //       email: data.email,
  //       display_name: data.displayName
  //     }
  //   })
  //   queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  // }

  // const handleDeleteUser = async (userUid: string) => {
  //   await deleteUser({
  //     user_uid: userUid
  //   })
  //   queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  // }

  // const handleUpdateUserAdmin = async (userUid: string, isAdmin: boolean) => {
  //   await updateUserAdmin({
  //     user_uid: userUid,
  //     body: {
  //       admin: isAdmin
  //     }
  //   })
  //   queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  // }

  // const handleUpdatePassword = async (userId: string, password: string) => {
  //   await updateUser({
  //     user_uid: userId,
  //     body: {
  //       password: password
  //     }
  //   })
  //   queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  // }
  return (
    <UserManagementPage
      useAdminListUsersStore={useAdminListUsersStore}
      useTranslationStore={useTranslationStore}
      // handleUpdateUser={handleUpdateUser}
      // handleDeleteUser={handleDeleteUser}
      // handleUpdatePassword={handleUpdatePassword}
      // updateUserAdmin={handleUpdateUserAdmin}
    />
  )
}
