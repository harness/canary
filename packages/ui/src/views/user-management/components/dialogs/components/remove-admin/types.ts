export interface IRemoveAdminFormProps {
  handleUpdateUserAdmin: (userId: string, isAdmin: boolean) => void
  onClose: () => void
}

export interface IRemoveAdminDialogProps {
  open: boolean
  onClose: () => void
  handleUpdateUserAdmin: (userId: string, isAdmin: boolean) => void
}
