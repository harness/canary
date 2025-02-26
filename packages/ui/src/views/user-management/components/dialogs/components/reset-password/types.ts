export interface IResetPasswordFormProps {
  handleUpdatePassword: (userId: string) => void
  onClose: () => void
}

export interface IResetPasswordDialogProps {
  open: boolean
  onClose: () => void
  handleUpdatePassword: (userId: string) => void
}
