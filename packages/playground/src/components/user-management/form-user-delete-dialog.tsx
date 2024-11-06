import React from 'react'

import {
  Spacer,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
  Icon,
  Text,
  Badge
} from '@harnessio/canary'
import { FormDeleterDialogProps } from './interfaces'

//Form Delete Member Dialog
export const FormDeleteUserDialog: React.FC<FormDeleterDialogProps> = ({
  user,
  onClose,
  onDelete,
  isDeleting,
  deleteSuccess,
  handleDeleteUser
}) => {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete
            <Badge type="admin" className="mx-2" variant="muted" disableHover={true}>
              <Text>{user?.display_name}</Text>
            </Badge>
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user "{user?.display_name}" from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Spacer size={3} />
        <AlertDialogFooter>
          {!isDeleting && !deleteSuccess && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          {deleteSuccess ? (
            <Button size="default" theme="success" className="self-start pointer-events-none flex gap-2">
              Users deleted
              <Icon name="tick" size={14} />
            </Button>
          ) : (
            <Button
              size="default"
              theme="error"
              className="self-start"
              onClick={() => {
                handleDeleteUser(user!.uid!)
                onDelete()
              }}
              disabled={isDeleting}>
              {isDeleting ? 'Deleting user...' : 'Yes, delete user'}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
