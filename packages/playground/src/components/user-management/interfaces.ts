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

export interface DialogState {
  isDialogDeleteOpen: boolean
  isDialogEditOpen: boolean
  isDialogRemoveAdminOpen: boolean
  isDialogResetPasswordOpen: boolean
  isDialogSetAdminOpen: boolean
  isDeleting: boolean
  isSubmitting: boolean
  submitted: boolean
  isRemoving: boolean
  isResetting: boolean
  deleteSuccess: boolean
  submitSuccess: boolean
  removeSuccess: boolean
  resetSuccess: boolean
  selectedUser: UsersProps | null // Holds the currently selected user for edit/delete actions
}

// Enum for dialog action types
export enum DialogActionType {
  OPEN_DIALOG = 'OPEN_DIALOG',
  CLOSE_DIALOG = 'CLOSE_DIALOG',
  START_DELETING = 'START_DELETING',
  DELETE_SUCCESS = 'DELETE_SUCCESS',
  START_SUBMITTING = 'START_SUBMITTING',
  SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
  START_REMOVING = 'START_REMOVING',
  REMOVE_SUCCESS = 'REMOVE_SUCCESS',
  START_RESETTING = 'START_RESETTING',
  RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
  RESET_DELETE = 'RESET_DELETE',
  RESET_SUBMIT = 'RESET_SUBMIT',
  RESET_REMOVE = 'RESET_REMOVE',
  RESET_PASSWORD_RESET = 'RESET_PASSWORD_RESET'
}

export enum DialogType {
  EDIT = 'edit',
  DELETE = 'delete',
  REMOVE_ADMIN = 'removeAdmin',
  SET_ADMIN = 'setAdmin',
  RESET_PASSWORD = 'resetPassword'
}

export type DialogAction =
  | {
      type: DialogActionType.OPEN_DIALOG
      dialogType: DialogType
      user: UsersProps
    }
  | { type: DialogActionType.CLOSE_DIALOG; dialogType: DialogType }
  | { type: DialogActionType.START_DELETING }
  | { type: DialogActionType.DELETE_SUCCESS }
  | { type: DialogActionType.START_SUBMITTING }
  | { type: DialogActionType.SUBMIT_SUCCESS }
  | { type: DialogActionType.START_REMOVING }
  | { type: DialogActionType.REMOVE_SUCCESS }
  | { type: DialogActionType.START_RESETTING }
  | { type: DialogActionType.RESET_PASSWORD_SUCCESS }
  | { type: DialogActionType.RESET_DELETE }
  | { type: DialogActionType.RESET_SUBMIT }
  | { type: DialogActionType.RESET_REMOVE }
  | { type: DialogActionType.RESET_PASSWORD_RESET }

export interface FormRemoveUserDialogProps {
  user: UsersProps | null
  onClose: () => void
  onRemove: () => void
  isRemoving: boolean
  removeSuccess: boolean
  updateUserAdmin: (uid: string, admin: boolean) => void
}

export interface FormResetPasswordsDialogProps {
  user: UsersProps | null
  onClose: () => void
  handleUpdatePassword: (userId: string, password: string) => void
}

export interface FormDeleterDialogProps {
  user: UsersProps | null
  onClose: () => void
  onDelete: () => void
  isDeleting: boolean
  deleteSuccess: boolean
  handleDeleteUser: (userUid: string) => void
}

export interface FormEditDialogProps {
  isSubmitting: boolean
  submitted: boolean
  user: { uid?: string; email?: string; display_name?: string }
  onSave: () => void
  onClose: () => void
  handleUpdateUser: (data: { email: string; displayName: string; userID: string }) => void
}
