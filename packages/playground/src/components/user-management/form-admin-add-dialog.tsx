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

//Form Add Admin Dialog
export const FormAddAdminDialog: React.FC<FormRemoveUserDialogProps> = ({
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
            Are you sure you want to add
            <Badge type="admin" className="mx-2" variant="muted" disableHover={true}>
              <Text>{user?.display_name}</Text>
            </Badge>
            as an admin?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will add an admin tag for "{user?.display_name}" ({user?.uid}).
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
              Admin added
              <Icon name="tick" size={14} />
            </Button>
          ) : (
            <Button
              size="default"
              theme="error"
              className="self-start"
              onClick={() => {
                updateUserAdmin(user?.uid, true)
                onRemove()
              }}
              disabled={isRemoving || removeSuccess}>
              {isRemoving ? 'Adding admin...' : 'Yes, add admin'}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
