import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import {
  useAdminCreateUserMutation,
  useAdminDeleteUserMutation,
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
  useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import { IDataHandlers, UserManagementPage } from '@harnessio/ui/views'

import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useAdminListUsersStore } from './stores/admin-list-store'
import { promisifyMutation } from './utils/promisify-mutation'

export const UserManagementPageContainer = () => {
  const queryClient = useQueryClient()

  const { setUsers, setTotalPages, setPage, page, password } = useAdminListUsersStore()

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
      setTotalPages(headers)
    }
  }, [userData, setUsers, setTotalPages, headers])

  const {
    mutate: updateUser,
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
    mutate: deleteUser,
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
    mutate: updateUserAdmin,
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
    mutate: createUser,
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

  const handleCreateUser: IDataHandlers['handleCreateUser'] = data => {
    return promisifyMutation(createUser, {
      body: {
        uid: data.uid,
        email: data.email,
        display_name: data.display_name,
        password: password ?? ''
      }
    })
  }

  const handleUpdateUser: IDataHandlers['handleUpdateUser'] = data => {
    return promisifyMutation(updateUser, {
      user_uid: data.userID,
      body: {
        email: data.email,
        display_name: data.displayName
      }
    })
  }

  const handleDeleteUser: IDataHandlers['handleDeleteUser'] = userUid => {
    return promisifyMutation(deleteUser, {
      user_uid: userUid
    })
  }

  const handleUpdateUserAdmin: IDataHandlers['handleUpdateUserAdmin'] = (userUid, isAdmin) => {
    return promisifyMutation(updateUserAdmin, {
      user_uid: userUid,
      body: {
        admin: isAdmin
      }
    })
  }

  const handleUpdatePassword: IDataHandlers['handleUpdatePassword'] = userId => {
    return promisifyMutation(updateUser, {
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
        useTranslationStore={useTranslationStore}
        handlers={handlers}
        loadingStates={loadingStates}
        errorStates={errorStates}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
    </>
  )
}
