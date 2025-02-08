import { AlertDialog, Button } from '@/components'

import { IRemoveAdminDialogProps } from '../types'

// Form Remove/Add Admin Dialog
export const AdminDialog: React.FC<IRemoveAdminDialogProps> = ({
  useAdminListUsersStore,
  open,
  onClose,
  isLoading,
  updateUserAdmin
}) => {
  const { user } = useAdminListUsersStore()
  const isAdmin = user?.admin ?? false

  return (
    <AlertDialog.Root open={open} onOpenChange={onClose}>
      <AlertDialog.Trigger asChild></AlertDialog.Trigger>
      <AlertDialog.Content onClose={onClose}>
        <AlertDialog.Header>
          <AlertDialog.Title>
            {isAdmin ? `Are you sure you want to remove ` : `Are you sure you want to grant `}
            {user?.display_name}
            {isAdmin ? ` as an admin?` : ` admin privileges?`}
          </AlertDialog.Title>
          <AlertDialog.Description>
            {isAdmin
              ? `This will remove the admin tag for "${user?.display_name}".`
              : `This will grant admin privileges to "${user?.display_name}".`}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            size="default"
            theme={isAdmin ? 'error' : 'primary'}
            className="self-start"
            onClick={() => {
              updateUserAdmin(user?.uid ?? '', !isAdmin)
            }}
          >
            {isLoading
              ? isAdmin
                ? 'Removing admin...'
                : 'Granting admin...'
              : isAdmin
                ? 'Yes, remove admin'
                : 'Yes, grant admin'}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
