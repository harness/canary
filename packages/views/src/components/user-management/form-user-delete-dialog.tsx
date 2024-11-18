import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Icon,
  Spacer,
  Text
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
            <Badge className="mx-2" disableHover={true}>
              <Text>{user?.display_name}</Text>
            </Badge>
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user &quot;{user?.display_name}&quot; from the system.
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
            <Button size="default" theme="success" className="pointer-events-none flex gap-2 self-start">
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
