import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@harnessio/canary'

import { AlertDeleteDialogForm } from './alert-delete-dialog-form'

interface AlertDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  handleDeleteRepository: (identifier: string) => void
  identifier: string
  isDeletingRepo: boolean
  error: string | null
  type: string
}
export const AlertDeleteDialog: React.FC<AlertDeleteDialogProps> = ({
  open,
  onOpenChange,
  handleDeleteRepository,
  identifier,
  isDeletingRepo,
  error,
  type
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your {type} and remove all data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDeleteDialogForm
          deleteFn={handleDeleteRepository}
          identifier={identifier}
          onClose={onOpenChange}
          isLoading={isDeletingRepo}
          error={error}
          type={type}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}
