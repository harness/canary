import { Button, ButtonLayout, CopyButton, Dialog, Input, Text } from '@/components'
import { useTranslation } from '@/context'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { useStates } from '@views/user-management/providers/state-provider'

interface ResetPasswordDialogProps {
  handleUpdatePassword: (userId: string) => void
  open: boolean
  onClose: () => void
}

export function ResetPasswordDialog({ handleUpdatePassword, open, onClose }: ResetPasswordDialogProps) {
  const { useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslation()
  const { user, generatePassword, setGeneratePassword, password } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isUpdatingUser } = loadingStates
  const { updateUserError } = errorStates

  const onSubmit = () => {
    handleUpdatePassword(user?.uid || '')
    setGeneratePassword(true)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>
            {t('views:userManagement.resetPassword.title', 'Are you sure you want to reset password for {name}?', {
              name: user?.display_name || ''
            })}
          </Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          {generatePassword ? (
            <Text>
              {t(
                'views:userManagement.resetPassword.passwordGeneratedMessage',
                "Your password has been generated. Please make sure to copy and store your password somewhere safe, you won't be able to see it again."
              )}
            </Text>
          ) : (
            <Text
              dangerouslySetInnerHTML={{
                __html: t(
                  'views:userManagement.resetPassword.message',
                  'A new password will be generated to assist <strong>{{name}}</strong> in resetting their current password.',
                  { name: user?.display_name }
                )
              }}
            />
          )}

          {generatePassword && (
            <Input
              size="md"
              id="password"
              value={password ?? ''}
              readOnly
              rightElement={<CopyButton name={password ?? ''} />}
            />
          )}

          {updateUserError && (
            <Text as="span" color="danger">
              {updateUserError}
            </Text>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={onClose} disabled={isUpdatingUser}>
              {generatePassword ? t('views:userManagement.close', 'Close') : t('views:userManagement.cancel', 'Cancel')}
            </Dialog.Close>
            {!generatePassword && (
              <Button type="button" onClick={onSubmit} disabled={isUpdatingUser}>
                {isUpdatingUser
                  ? t('views:userManagement.resetPassword.pending', 'Resetting Password...')
                  : t('views:userManagement.resetPassword.confirm', 'Confirm')}
              </Button>
            )}
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
