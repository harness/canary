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
  handleDialogOpen: (user: UsersProps, dialogLabel: string) => void
}
export interface IAdminListUsersStore {
  users: UsersProps[]
  totalPages: number
  page: number
  setPage: (data: number) => void
  setUsers: (data: UsersProps[]) => void
  setTotalPages: (data: Headers) => void
}

export interface IDeleteDialogProps {
  open: boolean
  user: UsersProps | null
  onClose: () => void
  isDeleting: boolean
  handleDeleteUser: (userUid: string) => void
}

export interface IEditUserDialogProps {
  isSubmitting: boolean
  user: { uid?: string; email?: string; display_name?: string }
  onClose: () => void
  handleUpdateUser: (data: { email: string; displayName: string; userID: string }) => void
  open: boolean
}

export interface IRemoveAdminDialogProps {
  open: boolean
  user: UsersProps | null
  onClose: () => void
  isLoading: boolean
  updateUserAdmin: (uid: string, admin: boolean) => void
}

export interface IResetPasswordDialogProps {
  user: UsersProps | null
  onClose: () => void
  open: boolean
  handleUpdatePassword: (userId: string, password: string) => void
}

export enum DialogLabels {
  DELETE_USER = 'deleteUser',
  EDIT_USER = 'editUser',
  TOGGLE_ADMIN = 'toggleAdmin',
  RESET_PASSWORD = 'resetPassword'
}
