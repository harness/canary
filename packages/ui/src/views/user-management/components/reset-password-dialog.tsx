import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  CopyButton,
  Input,
  Text
} from '@/components'

import { IResetPasswordDialogProps } from '../types'

export const ResetPasswordDialog: React.FC<IResetPasswordDialogProps> = ({
  open,
  useAdminListUsersStore,
  onClose,
  handleUpdatePassword
}) => {
  const { user, generatePassword, setGeteneratePassword, password } = useAdminListUsersStore()

  const handleResetPassword = () => {
    handleUpdatePassword(user?.uid ?? '')
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {generatePassword ? (
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
          ) : (
            <AlertDialogTitle>Are you sure you want to reset password for {user?.display_name}?</AlertDialogTitle>
          )}
          <AlertDialogDescription>
            {generatePassword ? (
              <Text as="div" color="tertiaryBackground" className="mb-4">
                Your password has been generated. Please make sure to copy and store your password somewhere safe, you
                won&apos;t be able to see it again.
              </Text>
            ) : (
              <Text as="div" color="tertiaryBackground" className="mb-4">
                A new password will be generated to assist {user?.display_name} in resetting their current password.
              </Text>
            )}
            {generatePassword && (
              <Input
                id="identifier"
                value={password ?? ''}
                readOnly
                rightElement={<CopyButton name={password ?? ''} />}
              />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            {generatePassword ? `Close` : `Cancel`}
          </Button>
          {!generatePassword && (
            <Button
              size="default"
              variant="secondary"
              className="self-start"
              onClick={() => {
                handleResetPassword()
                setGeteneratePassword(true)
              }}
            >
              Confirm
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
