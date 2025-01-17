import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spacer
} from '@/components'

import { IDeleteDialogProps } from '../types'

export const DeleteUserDialog: React.FC<IDeleteDialogProps> = ({
  useAdminListUsersStore,
  onClose,
  isDeleting,
  handleDeleteUser,
  open
}) => {
  const { user } = useAdminListUsersStore()
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete {user?.display_name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user &quot;{user?.display_name}&quot; from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Spacer size={3} />
        <AlertDialogFooter>
          {!isDeleting && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}

          <Button
            size="default"
            theme="error"
            className="self-start"
            onClick={() => {
              handleDeleteUser(user!.uid ?? '')
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting user...' : 'Yes, delete user'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
