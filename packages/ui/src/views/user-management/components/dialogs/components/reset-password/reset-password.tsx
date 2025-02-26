import { Button, ButtonGroup, CopyButton, Dialog, Input } from '@/components'
import { IResetPasswordDialogProps } from '@/views/user-management/components/dialogs/components/reset-password/types'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export function ResetPasswordDialog({ handleUpdatePassword, open, onClose }: IResetPasswordDialogProps) {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslationStore()
  const { user, generatePassword, setGeteneratePassword, password } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isUpdatingUser } = loadingStates
  const { updateUserError } = errorStates

  const onSubmit = () => {
    handleUpdatePassword(user?.uid || '')
    setGeteneratePassword(true)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {t('views:userManagement.resetPassword', 'Are you sure you want to reset password for {name}?', {
              name: user?.display_name || ''
            })}
          </Dialog.Title>
        </Dialog.Header>

        {/* TODO: investigate how to make user login bold with font-weight: 600 */}
        <div className="flex flex-col gap-y-7">
          <span>
            {generatePassword
              ? t(
                  'views:userManagement.passwordGeneratedMessage',
                  "Your password has been generated. Please make sure to copy and store your password somewhere safe, you won't be able to see it again."
                )
              : t(
                  'views:userManagement.resetPasswordMessage',
                  'A new password will be generated to assist {name} in resetting their current password.',
                  { name: user?.display_name || '' }
                )}
          </span>

          {generatePassword && (
            <Input
              size="md"
              id="password"
              value={password ?? ''}
              readOnly
              rightElement={<CopyButton name={password ?? ''} />}
            />
          )}

          {updateUserError && <span className="text-xs text-destructive">{updateUserError}</span>}
        </div>

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdatingUser}>
              {generatePassword ? t('views:userManagement.close', 'Close') : t('views:userManagement.cancel', 'Cancel')}
            </Button>
            {!generatePassword && (
              <Button type="button" onClick={onSubmit} disabled={isUpdatingUser}>
                {isUpdatingUser
                  ? t('views:userManagement.resettingPassword', 'Resetting Password...')
                  : t('views:userManagement.resetPasswordConfirm', 'Confirm')}
              </Button>
            )}
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
