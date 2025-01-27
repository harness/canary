import { FC } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { IUserManagementPageProps, UserManagementPage } from '@harnessio/ui/views'

const UserManagementWrapper: FC<Partial<IUserManagementPageProps>> = () => {
  const user = {
    uid: 'user-1',
    email: 'user-1@example.com',
    display_name: 'User 1',
    admin: true,
    blocked: false
  }

  const useAdminListUsersStore = () => ({
    users: [user],
    totalPages: 1,
    page: 1,
    password: null,
    user: user,
    generatePassword: false,
    setPage: noop,
    setUser: noop,
    setUsers: noop,
    setTotalPages: noop,
    setPassword: noop,
    setGeteneratePassword: noop
  })

  return (
    <UserManagementPage
      useAdminListUsersStore={useAdminListUsersStore}
      useTranslationStore={useTranslationStore}
      handlers={{
        handleUpdateUser: async () => {},
        handleDeleteUser: async () => {},
        handleUpdateUserAdmin: async () => {},
        handleUpdatePassword: async () => {},
        handleCreateUser: async () => {}
      }}
      loadingStates={{
        isFetchingUsers: false,
        isUpdatingUser: false,
        isDeletingUser: false,
        isUpdatingUserAdmin: false,
        isCreatingUser: false
      }}
      errorStates={{
        fetchUsersError: '',
        updateUserError: '',
        deleteUserError: '',
        updateUserAdminError: '',
        createUserError: ''
      }}
      searchQuery={''}
      setSearchQuery={noop}
    />
  )
}

export default UserManagementWrapper
