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
  Badge,
  Text
} from '@harnessio/canary'
import { FormRemoveUserDialogProps } from './interfaces'

//Form Remove Admin Dialog
export const FormRemoveAdminDialog: React.FC<FormRemoveUserDialogProps> = ({
  user,
  onClose,
  onRemove,
  isRemoving,
  removeSuccess,
  updateUserAdmin
}) => {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove
            <Badge type="admin" className="mx-2" variant="muted" disableHover={true}>
              <Text>{user?.display_name}</Text>
            </Badge>
            as an admin?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove a admin tag for "{user?.display_name}" ({user?.uid}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Spacer size={3} />
        <AlertDialogFooter>
          {!isRemoving && !removeSuccess && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          {removeSuccess ? (
            <Button size="default" theme="success" className="self-start pointer-events-none flex gap-2">
              Admin removed
              <Icon name="tick" size={14} />
            </Button>
          ) : (
            <Button
              size="default"
              theme="error"
              className="self-start"
              onClick={() => {
                updateUserAdmin(user!.uid!, false)
                onRemove()
              }}
              disabled={isRemoving || removeSuccess}>
              {isRemoving ? 'Removing admin...' : 'Yes, remove admin'}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
