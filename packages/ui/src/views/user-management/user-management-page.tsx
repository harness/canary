import { DialogsProvider } from '@/views/user-management/providers/dialogs-provider'
import { SearchProvider } from '@/views/user-management/providers/search-provider'
import { StateProvider } from '@/views/user-management/providers/state-provider'
import { UserManagementStoreProvider } from '@/views/user-management/providers/store-provider'
import { IUserManagementPageProps } from '@/views/user-management/types'

import { UserManagementPageContent } from './components'

export const UserManagementPage: React.FC<IUserManagementPageProps> = ({
  useAdminListUsersStore,
  useTranslationStore,
  handlers,
  loadingStates,
  errorStates,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <UserManagementStoreProvider
      useAdminListUsersStore={useAdminListUsersStore}
      useTranslationStore={useTranslationStore}
    >
      <StateProvider loadingStates={loadingStates} errorStates={errorStates}>
        <SearchProvider searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
          <DialogsProvider>
            <UserManagementPageContent handlers={handlers} />
          </DialogsProvider>
        </SearchProvider>
      </StateProvider>
    </UserManagementStoreProvider>
  )
}
