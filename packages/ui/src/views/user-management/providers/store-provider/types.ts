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
  setGeteneratePassword: (data: boolean) => void
}

export interface StoreProviderProps {
  useAdminListUsersStore: () => IAdminListUsersStore
  useTranslationStore: () => TranslationStore
  children: React.ReactNode
}

export interface StoreContextType {
  useAdminListUsersStore: () => IAdminListUsersStore
  useTranslationStore: () => TranslationStore
}
