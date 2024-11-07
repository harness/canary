import { SandboxSettingsUserManagementPage, useCommonFilter } from '@harnessio/playground'
import {
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useUpdateUserAdminMutation,
  AdminListUsersQueryQueryParams
} from '@harnessio/code-service-client'
import { parseAsInteger, useQueryState } from 'nuqs'
import { PageResponseHeader } from '../types'

export const UserManagementPageContainer = () => {
  const { query: _currentQuery, sort } = useCommonFilter<AdminListUsersQueryQueryParams['sort']>()
  // const [query, _] = useQueryState('query', { defaultValue: currentQuery || '' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const changePage = (pageNum: number) => setPage(pageNum)

  const { data: { body: userData, headers } = {}, refetch: refetchUsers } = useAdminListUsersQuery({
    queryParams: {
      page: page,
      limit: 30,
      sort: sort
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
    refetchUsers()
  }

  const handleDeleteUser = async (userUid: string) => {
    await deleteUser({
      user_uid: userUid
    })
    refetchUsers()
  }

  const handleUpdateUserAdmin = async (userUid: string, isAdmin: boolean) => {
    await updateUserAdmin({
      user_uid: userUid,
      body: {
        admin: isAdmin
      }
    })
    refetchUsers()
  }

  const handleUpdatePassword = async (userId: string, password: string) => {
    await updateUser({
      user_uid: userId,
      body: {
        password: password
      }
    })
    refetchUsers()
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
