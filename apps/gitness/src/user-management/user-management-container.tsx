import { SandboxSettingsUserManagementPage, useCommonFilter } from '@harnessio/playground'
import {
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useUpdateUserAdminMutation,
  AdminListUsersQueryQueryParams
} from '@harnessio/code-service-client'
import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'
import { PageResponseHeader } from '../types'

export const UserManagementPageContainer = () => {
  const queryClient = useQueryClient()

  const { query: _currentQuery, sort } = useCommonFilter<AdminListUsersQueryQueryParams['sort']>()
  // const [query, _] = useQueryState('query', { defaultValue: currentQuery || '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const changePage = (pageNum: number) => setPage(pageNum)

  const { data: { body: userData, headers } = {} } = useAdminListUsersQuery({
    queryParams: {
      page: page,
      limit: 30,
      sort: sort
    }
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  const { mutate: updateUser } = useAdminUpdateUserMutation(
    {},
    {
      onSuccess: () => {
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
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutate: updateUserAdmin } = useUpdateUserAdminMutation(
    {},
    {
      onSuccess: () => {
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
    <SandboxSettingsUserManagementPage
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
