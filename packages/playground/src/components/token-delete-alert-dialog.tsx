import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button
} from '@harnessio/canary'

interface DeleteTokenAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier: string
  deleteFn: (id: string) => void
  type: string
  isLoading: boolean
}
export const DeleteTokenAlertDialog: React.FC<DeleteTokenAlertDialogProps> = ({
  open,
  onClose,
  identifier,
  deleteFn,
  type,
  isLoading
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your {type} and remove all data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="default"
            theme="error"
            className="self-start"
            variant="destructive"
            disabled={isLoading}
            onClick={() => {
              deleteFn(identifier)
            }}>
            {isLoading ? `Deleting ${type}...` : `Yes, delete ${type}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
