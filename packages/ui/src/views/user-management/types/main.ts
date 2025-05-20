import { IDataHandlers } from '@/views'
import { IErrorStates, ILoadingStates } from '@/views/user-management/providers/state-provider/types'
import { IAdminListUsersStore } from '@/views/user-management/providers/store-provider'

export interface UsersProps {
  admin?: boolean
  uid?: string
  display_name?: string
  email?: string
  created?: number
  updated?: number
  avatarUrl?: string
  blocked?: boolean
}

export interface IUserManagementPageProps {
  useAdminListUsersStore: () => IAdminListUsersStore
  handlers: IDataHandlers
  loadingStates: ILoadingStates
  errorStates: IErrorStates
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
}
