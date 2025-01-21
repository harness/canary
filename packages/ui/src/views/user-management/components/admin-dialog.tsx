import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button
} from '@/components'

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
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAdmin ? `Are you sure you want to remove ` : `Are you sure you want to grant `}
            {user?.display_name}
            {isAdmin ? ` as an admin?` : ` admin privileges?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isAdmin
              ? `This will remove the admin tag for "${user?.display_name}".`
              : `This will grant admin privileges to "${user?.display_name}".`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
