import { Button, ButtonGroup, Dialog } from '@/components'
import { IDeleteDialogProps } from '@/views/user-management/components/dialogs/components/delete-user/types'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { useStates } from '@views/user-management/providers/state-provider'

export function DeleteUserDialog({ onClose, handleDeleteUser, open }: IDeleteDialogProps) {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()

  const { t } = useTranslationStore()
  const { user } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()

  const { isDeletingUser } = loadingStates
  const { deleteUserError } = errorStates

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {t('views:userManagement.deleteConfirmation', 'Are you sure you want to delete {{name}}?', {
              name: user?.display_name
            })}
          </Dialog.Title>
          <Dialog.Description>
            {/* TODO: investigate how to make user login bold with font-weight: 600 */}
            {t(
              'views:userManagement.deleteWarning',
              'This will permanently delete the user "{{name}}" from the system.',
              {
                name: user?.display_name
              }
            )}
          </Dialog.Description>
        </Dialog.Header>

        {deleteUserError && <span className="text-xs text-destructive">{deleteUserError}</span>}

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            {!isDeletingUser && (
              <Button type="button" variant="outline" onClick={onClose}>
                {t('views:userManagement.cancel', 'Cancel')}
              </Button>
            )}

            <Button
              theme="error"
              className="self-start"
              onClick={() => handleDeleteUser(user!.uid ?? '')}
              disabled={isDeletingUser}
            >
              {isDeletingUser
                ? t('views:userManagement.deletingUser', 'Deleting user...')
                : t('views:userManagement.confirmDelete', 'Yes, delete user')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
