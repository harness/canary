import React, { useState } from 'react'
import {
  Spacer,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  Button,
  Icon
} from '@harnessio/canary'

interface UsersProps {
  admin: boolean
  uid: string
  display_name?: string // Add a default value of undefined
  email: string
  created: number // Add a default value of undefined
  updated?: number
  avatarUrl?: string
  blocked?: boolean
}

interface FormRemoveUserDialogProps {
  user: UsersProps | null
  onClose: () => void
}

//Form Remove Admin Dialog
export const FormRemoveUserDialog: React.FC<FormRemoveUserDialogProps> = ({ user, onClose }) => {
  const [isRemoving, setIsRemoving] = useState(false)
  const [removeSuccess, setRemoveSuccess] = useState(false)
  // Delete project handler
  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      setIsRemoving(false)
      setRemoveSuccess(true) // Mark deletion as successful
      setTimeout(() => {
        onClose() // Close the dialog
      }, 2000)
    }, 2000)
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to remove {user?.display_name} as an admin?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove a admin tag for {user?.display_name} ({user?.uid}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Spacer size={3} />
        <AlertDialogFooter>
          {!isRemoving && !removeSuccess && <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>}
          {removeSuccess ? (
            <Button size="default" theme="success" className="self-start pointer-events-none">
              Users removed&nbsp;&nbsp;
              <Icon name="tick" size={14} />
            </Button>
          ) : (
            <Button size="default" theme="error" className="self-start" onClick={handleRemove}>
              {isRemoving ? 'Removing Member...' : 'Yes, remove Member'}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
