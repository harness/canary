import { Button, ButtonGroup, CopyButton, Dialog, Input } from '@/components'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { useStates } from '@views/user-management/providers/state-provider'

interface ResetPasswordDialogProps {
  handleUpdatePassword: (userId: string) => void
  open: boolean
  onClose: () => void
}

export function ResetPasswordDialog({ handleUpdatePassword, open, onClose }: ResetPasswordDialogProps) {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslationStore()
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
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {t('views:userManagement.resetPassword.title', 'Are you sure you want to reset password for {name}?', {
              name: user?.display_name || ''
            })}
          </Dialog.Title>
        </Dialog.Header>

        <div className="flex flex-col gap-y-7">
          {generatePassword ? (
            <span>
              {t(
                'views:userManagement.resetPassword.passwordGeneratedMessage',
                "Your password has been generated. Please make sure to copy and store your password somewhere safe, you won't be able to see it again."
              )}
            </span>
          ) : (
            <span
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

          {updateUserError && <span className="text-2 text-cn-foreground-danger">{updateUserError}</span>}
        </div>

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button type="button" variant="surface" theme="muted" onClick={onClose} disabled={isUpdatingUser}>
              {generatePassword ? t('views:userManagement.close', 'Close') : t('views:userManagement.cancel', 'Cancel')}
            </Button>
            {!generatePassword && (
              <Button type="button" onClick={onSubmit} disabled={isUpdatingUser}>
                {isUpdatingUser
                  ? t('views:userManagement.resetPassword.pending', 'Resetting Password...')
                  : t('views:userManagement.resetPassword.confirm', 'Confirm')}
              </Button>
            )}
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
