import { AlertDialog, Button, Spacer } from '@/components'

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
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Trigger asChild></AlertDialog.Trigger>
      <AlertDialog.Content onClose={onClose}>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you sure you want to delete {user?.display_name}?</AlertDialog.Title>
          <AlertDialog.Description>
            This will permanently delete the user &quot;{user?.display_name}&quot; from the system.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <Spacer size={3} />
        <AlertDialog.Footer>
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
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
