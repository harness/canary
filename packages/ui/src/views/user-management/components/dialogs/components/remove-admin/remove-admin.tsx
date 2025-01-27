import { Button, ButtonGroup, Dialog } from '@/components'
import { IRemoveAdminDialogProps } from '@/views/user-management/components/dialogs/components/remove-admin/types'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export function RemoveAdminDialog({ handleUpdateUserAdmin, open, onClose }: IRemoveAdminDialogProps) {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslationStore()
  const { user } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isUpdatingUserAdmin } = loadingStates
  const { updateUserAdminError } = errorStates

  const isAdmin = user?.admin ?? false

  const handleSubmit = () => {
    handleUpdateUserAdmin(user?.uid || '', !isAdmin)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {t('views:userManagement.updateAdminRights', 'Are you sure you want to remove {name} as an admin?', {
              name: user?.display_name
            })}
          </Dialog.Title>
        </Dialog.Header>

        {/* TODO: investigate how to make user login bold with font-weight: 600 */}
        <div className="flex flex-col gap-y-7">
          <span>
            {isAdmin
              ? t('views:userManagement.removeAdminMessage', 'This will remove the admin tag for "{{name}}"', {
                  name: user?.display_name
                })
              : t('views:userManagement.grantAdminMessage', 'This will grant admin privileges to "{{name}}"', {
                  name: user?.display_name
                })}
          </span>

          {updateUserAdminError && <span className="text-xs text-destructive">{updateUserAdminError}</span>}
        </div>

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdatingUserAdmin}>
              {t('views:userManagement.cancel', 'Cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              theme={isAdmin ? 'error' : 'primary'}
              disabled={isUpdatingUserAdmin}
            >
              {isUpdatingUserAdmin
                ? isAdmin
                  ? t('views:userManagement.removingAdmin', 'Removing admin...')
                  : t('views:userManagement.grantingAdmin', 'Granting admin...')
                : isAdmin
                  ? t('views:userManagement.removeAdmin', 'Yes, remove admin')
                  : t('views:userManagement.grantAdmin', 'Yes, grant admin')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
