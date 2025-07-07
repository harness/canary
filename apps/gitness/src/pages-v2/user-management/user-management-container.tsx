import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import {
  useAdminCreateUserMutation,
  useAdminDeleteUserMutation,
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import { ICreateUserData, IUpdateUserData, UserManagementPage } from '@harnessio/ui/views'

import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useAdminListUsersStore } from './stores/admin-list-store'

export const UserManagementPageContainer = () => {
  const queryClient = useQueryClient()

  const { setUsers, setPaginationFromHeaders, setPage, page, password } = useAdminListUsersStore()

  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const {
    isFetching,
    error,
    data: { body: userData, headers } = {}
  } = useAdminListUsersQuery({
    queryParams: {
      page: queryPage,
      // TODO: add search functionality by query parameter
      //@ts-expect-error - query is not typed
      query: query ?? ''
    }
  })

  useEffect(() => {
    if (userData) {
      setUsers(userData)
    }
    if (headers) {
      setPaginationFromHeaders(headers)
    }
  }, [userData, setUsers, setPaginationFromHeaders, headers])

  const {
    mutateAsync: updateUser,
    isLoading: isUpdatingUser,
    error: updateUserError
  } = useAdminUpdateUserMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      }
    }
  )

  const {
    mutateAsync: deleteUser,
    isLoading: isDeletingUser,
    error: deleteUserError
  } = useAdminDeleteUserMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      }
    }
  )

  const {
    mutateAsync: updateUserAdmin,
    isLoading: isUpdatingUserAdmin,
    error: updateUserAdminError
  } = useUpdateUserAdminMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      }
    }
  )

  const {
    mutateAsync: createUser,
    isLoading: isCreatingUser,
    error: createUserError
  } = useAdminCreateUserMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      }
    }
  )

  const handleCreateUser = (data: ICreateUserData) => {
    return createUser({
      body: {
        uid: data.uid,
        email: data.email,
        display_name: data.display_name,
        password: password ?? ''
      }
    })
  }

  const handleUpdateUser = (data: IUpdateUserData) => {
    return updateUser({
      user_uid: data.userID,
      body: {
        email: data.email,
        display_name: data.displayName
      }
    })
  }

  const handleDeleteUser = (userUid: string) => {
    return deleteUser({
      user_uid: userUid
    })
  }

  const handleUpdateUserAdmin = (userUid: string, isAdmin: boolean) => {
    return updateUserAdmin({
      user_uid: userUid,
      body: {
        admin: isAdmin
      }
    })
  }

  const handleUpdatePassword = (userId: string) => {
    return updateUser({
      user_uid: userId,
      body: {
        password: password
      }
    })
  }

  const handlers = {
    handleUpdateUser,
    handleDeleteUser,
    handleUpdateUserAdmin,
    handleUpdatePassword,
    handleCreateUser
  }

  const loadingStates = {
    isFetchingUsers: isFetching,
    isUpdatingUser,
    isDeletingUser,
    isUpdatingUserAdmin,
    isCreatingUser
  }

  const errorStates = {
    fetchUsersError: error?.message?.toString() ?? '',
    updateUserError: updateUserError?.message?.toString() ?? '',
    deleteUserError: deleteUserError?.message?.toString() ?? '',
    updateUserAdminError: updateUserAdminError?.message?.toString() ?? '',
    createUserError: createUserError?.message?.toString() ?? ''
  }

  return (
    <>
      <UserManagementPage
        useAdminListUsersStore={useAdminListUsersStore}
        handlers={handlers}
        loadingStates={loadingStates}
        errorStates={errorStates}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
    </>
  )
}
