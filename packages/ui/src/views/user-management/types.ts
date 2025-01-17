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
  handleDialogOpen: (user: UsersProps | null, dialogLabel: string) => void
}
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

export interface IDeleteDialogProps {
  open: boolean
  onClose: () => void
  isDeleting: boolean
  handleDeleteUser: (userUid: string) => void
  useAdminListUsersStore: () => IAdminListUsersStore
}

export interface IEditUserDialogProps {
  isSubmitting: boolean
  onClose: () => void
  handleUpdateUser: (data: { email: string; displayName: string; userID: string }) => void
  open: boolean
  useAdminListUsersStore: () => IAdminListUsersStore
}

export interface IRemoveAdminDialogProps {
  open: boolean
  onClose: () => void
  isLoading: boolean
  updateUserAdmin: (uid: string, admin: boolean) => void
  useAdminListUsersStore: () => IAdminListUsersStore
}

export interface IResetPasswordDialogProps {
  onClose: () => void
  open: boolean
  handleUpdatePassword: (userId: string) => void
  useAdminListUsersStore: () => IAdminListUsersStore
}

export enum DialogLabels {
  DELETE_USER = 'deleteUser',
  EDIT_USER = 'editUser',
  TOGGLE_ADMIN = 'toggleAdmin',
  RESET_PASSWORD = 'resetPassword',
  CREATE_USER = 'createUser'
}
