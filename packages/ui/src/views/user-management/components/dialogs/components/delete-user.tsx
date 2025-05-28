import { Button, ButtonLayout, ModalDialog } from '@/components'
import { useTranslation } from '@/context'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

interface DeleteUserDialogProps {
  handleDeleteUser: (uid: string) => void
  open: boolean
  onClose: () => void
}

export function DeleteUserDialog({ onClose, handleDeleteUser, open }: DeleteUserDialogProps) {
  const { useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslation()
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
    <ModalDialog.Root open={open} onOpenChange={onClose}>
      <ModalDialog.Content className="max-w-xl">
        <ModalDialog.Header>
          <ModalDialog.Title className="font-medium">
            {t('views:userManagement.deleteUser.title', 'Are you sure you want to delete {{name}}?', {
              name: user?.display_name
            })}
          </ModalDialog.Title>
          <ModalDialog.Description>
            <span
              dangerouslySetInnerHTML={{
                __html: t(
                  'views:userManagement.deleteUser.message',
                  'This will permanently delete the user <strong>"{{name}}"</strong> from the system.',
                  { name: user?.display_name }
                )
              }}
            />
          </ModalDialog.Description>
        </ModalDialog.Header>

        <ModalDialog.Body>
          {deleteUserError && <span className="text-2 text-cn-foreground-danger">{deleteUserError}</span>}
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ButtonLayout>
            {!isDeletingUser && (
              <ModalDialog.Close onClick={onClose}>{t('views:userManagement.cancel', 'Cancel')}</ModalDialog.Close>
            )}

            <Button variant="primary" theme="danger" onClick={onSubmit} disabled={isDeletingUser}>
              {isDeletingUser
                ? t('views:userManagement.deleteUser.pending', 'Deleting user...')
                : t('views:userManagement.deleteUser.confirm', 'Yes, delete user')}
            </Button>
          </ButtonLayout>
        </ModalDialog.Footer>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}
