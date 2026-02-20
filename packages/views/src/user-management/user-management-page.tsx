import { FC } from 'react'

import { DialogsProvider } from '@views/user-management/providers/dialogs-provider'
import { StateProvider } from '@views/user-management/providers/state-provider'
import { UserManagementStoreProvider } from '@views/user-management/providers/store-provider'
import { IUserManagementPageProps } from '@views/user-management/types'

import { UserManagementPageContent } from './components'

export const UserManagementPage: FC<IUserManagementPageProps> = ({
  useAdminListUsersStore,
  handlers,
  loadingStates,
  errorStates,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <UserManagementStoreProvider useAdminListUsersStore={useAdminListUsersStore}>
      <StateProvider loadingStates={loadingStates} errorStates={errorStates}>
        <DialogsProvider>
          <UserManagementPageContent handlers={handlers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </DialogsProvider>
      </StateProvider>
    </UserManagementStoreProvider>
  )
}
