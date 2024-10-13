import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Text,
  Spacer
} from '@harnessio/canary'

interface DeleteTokenAlertDialogProps {
  open: boolean
  onClose: () => void
  identifier?: string
  deleteFn: (id: string) => void
  type?: string
  isLoading?: boolean
  error?: { type: string; message: string } | null
}
export const DeleteTokenAlertDialog: React.FC<DeleteTokenAlertDialogProps> = ({
  open,
  onClose,
  identifier,
  deleteFn,
  type,
  isLoading,
  error
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
        <>
          {error && (error.type === 'tokenDelete' || error.type === 'keyDelete') && (
            <>
              <Text size={1} className="text-destructive">
                {error.message}
              </Text>
              <Spacer size={4} />
            </>
          )}
        </>
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
              deleteFn(identifier!)
            }}>
            {isLoading ? `Deleting ${type}...` : `Yes, delete ${type}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
