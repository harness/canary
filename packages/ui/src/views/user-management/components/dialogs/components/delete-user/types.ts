export interface IDeleteDialogProps {
  open: boolean
  onClose: () => void
  handleDeleteUser: (userUid: string) => void
}

export interface IDeleteUserFormProps {
  handleDeleteUser: (userUid: string) => void
  onClose: () => void
}
