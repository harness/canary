import { TranslationStore } from '@/views'

export interface UsersProps {
  admin?: boolean
  uid?: string
  display_name?: string | undefined
  email?: string
  created?: number
  updated?: number
  avatarUrl?: string
  blocked?: boolean
}

export interface IUserManagementPageProps {
  useAdminListUsersStore: () => IAdminListUsersStore
  useTranslationStore: () => TranslationStore
}
export interface IAdminListUsersStore {
  users: UsersProps[]
  totalPages: number
  page: number
  setPage: (data: number) => void
  setUsers: (data: UsersProps[]) => void
  setTotalPages: (data: Headers) => void
}
