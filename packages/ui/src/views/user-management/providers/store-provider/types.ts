import { PropsWithChildren } from 'react'

import { TranslationStore, UsersProps } from '@/views'

export interface IAdminListUsersStore {
  users: UsersProps[]
  totalPages: number
  page: number
  password: string | null
  user: UsersProps | null
  generatePassword: boolean
  setPassword: (password: string) => void
  setUser: (user: UsersProps) => void
  setPage: (data: number) => void
  setUsers: (data: UsersProps[]) => void
  setTotalPages: (data: Headers) => void
  setGeneratePassword: (data: boolean) => void
}

export interface StoreProviderProps extends PropsWithChildren<StoreContextType> {}

export interface StoreContextType {
  useAdminListUsersStore: () => IAdminListUsersStore
  useTranslationStore: () => TranslationStore
}
