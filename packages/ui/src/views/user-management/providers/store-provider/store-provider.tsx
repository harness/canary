import { createContext } from 'react'

import { StoreContextType, StoreProviderProps } from '@/views/user-management/providers/store-provider'

export const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const UserManagementStoreProvider = ({ children, useAdminListUsersStore }: StoreProviderProps) => {
  return <StoreContext.Provider value={{ useAdminListUsersStore }}>{children}</StoreContext.Provider>
}
