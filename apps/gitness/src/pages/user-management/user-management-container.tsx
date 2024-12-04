import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  AdminListUsersQueryQueryParams,
  useAdminDeleteUserMutation,
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import { SettingsUserManagementPage, useCommonFilter } from '@harnessio/views'

import { PageResponseHeader } from '../../types'

export const UserManagementPageContainer = () => {
  const { sort } = useCommonFilter<AdminListUsersQueryQueryParams['sort']>()
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const changePage = (pageNum: number) => setPage(pageNum)
  const queryClient = useQueryClient()
  const { data: { body: userData, headers } = {} } = useAdminListUsersQuery({
    queryParams: {
      page,
      sort
    }
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const { mutateAsync: updateUser } = useAdminUpdateUserMutation(
    {},
    {
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutateAsync: deleteUser } = useAdminDeleteUserMutation(
    {},
    {
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutateAsync: updateUserAdmin } = useUpdateUserAdminMutation(
    {},
    {
      onError: error => {
        console.error(error)
      }
    }
  )

  const handleUpdateUser = async (data: { email: string; displayName: string; userID: string }) => {
    await updateUser({
      user_uid: data.userID,
      body: {
        email: data.email,
        display_name: data.displayName
      }
    })
    queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  }

  const handleDeleteUser = async (userUid: string) => {
    await deleteUser({
      user_uid: userUid
    })
    queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  }

  const handleUpdateUserAdmin = async (userUid: string, isAdmin: boolean) => {
    await updateUserAdmin({
      user_uid: userUid,
      body: {
        admin: isAdmin
      }
    })
    queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  }

  const handleUpdatePassword = async (userId: string, password: string) => {
    await updateUser({
      user_uid: userId,
      body: {
        password: password
      }
    })
    queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
  }
  return (
    <SettingsUserManagementPage
      userData={userData ?? null}
      handleUpdateUser={handleUpdateUser}
      handleDeleteUser={handleDeleteUser}
      handleUpdatePassword={handleUpdatePassword}
      updateUserAdmin={handleUpdateUserAdmin}
      totalPages={totalPages}
      currentPage={page}
      setPage={changePage}
    />
  )
}
