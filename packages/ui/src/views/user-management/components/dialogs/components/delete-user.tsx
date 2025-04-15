import { Button, ButtonGroup, Dialog } from '@/components'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

interface DeleteUserDialogProps {
  handleDeleteUser: (uid: string) => void
  open: boolean
  onClose: () => void
}

export function DeleteUserDialog({ onClose, handleDeleteUser, open }: DeleteUserDialogProps) {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslationStore()
  const { user } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isDeletingUser } = loadingStates
  const { deleteUserError } = errorStates

  const onSubmit = () => {
    if (user?.uid) {
      handleDeleteUser(user.uid)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {t('views:userManagement.deleteUser.title', 'Are you sure you want to delete {{name}}?', {
              name: user?.display_name
            })}
          </Dialog.Title>
          <Dialog.Description>
            <span
              dangerouslySetInnerHTML={{
                __html: t(
                  'views:userManagement.deleteUser.message',
                  'This will permanently delete the user <strong>"{{name}}"</strong> from the system.',
                  { name: user?.display_name }
                )
              }}
            />
          </Dialog.Description>
        </Dialog.Header>

        {deleteUserError && <span className="text-2 text-cn-foreground-danger">{deleteUserError}</span>}

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            {!isDeletingUser && (
              <Button type="button" variant="surface" theme="muted" onClick={onClose}>
                {t('views:userManagement.cancel', 'Cancel')}
              </Button>
            )}

            <Button variant="soft" theme="danger" onClick={onSubmit} disabled={isDeletingUser}>
              {isDeletingUser
                ? t('views:userManagement.deleteUser.pending', 'Deleting user...')
                : t('views:userManagement.deleteUser.confirm', 'Yes, delete user')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
