import { Button, ButtonGroup, ControlGroup, Dialog, Fieldset, FormWrapper } from '@/components'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

interface RemoveAdminDialogProps {
  handleUpdateUserAdmin: (uid: string, isAdmin: boolean) => void
  open: boolean
  onClose: () => void
}

export function RemoveAdminDialog({ handleUpdateUserAdmin, open, onClose }: RemoveAdminDialogProps) {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslationStore()
  const { user } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isUpdatingUserAdmin } = loadingStates
  const { updateUserAdminError } = errorStates

  const isAdmin = !!user?.admin

  const handleSubmit = () => {
    handleUpdateUserAdmin(user?.uid || '', !isAdmin)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {isAdmin
              ? t('views:userManagement.removeAdmin.title', 'Are you sure you want to remove {name} as an admin?', {
                  name: user?.display_name
                })
              : t('views:userManagement.grantAdmin.title', 'Are you sure you want to grant {name} admin privileges?', {
                  name: user?.display_name
                })}
          </Dialog.Title>
        </Dialog.Header>

        <FormWrapper onSubmit={handleSubmit} id="remove-admin-form">
          <Fieldset>
            <ControlGroup>
              <span
                dangerouslySetInnerHTML={{
                  __html: isAdmin
                    ? t(
                        'views:userManagement.removeAdmin.message',
                        'This will remove the admin tag for <strong>"{{name}}"</strong> from the system.',
                        { name: user?.display_name }
                      )
                    : t(
                        'views:userManagement.grantAdmin.message',
                        'This will grant admin privileges to <strong>"{{name}}"</strong> from the system.',
                        { name: user?.display_name }
                      )
                }}
              />
            </ControlGroup>
          </Fieldset>

          {updateUserAdminError && <span className="text-2 text-cn-foreground-danger">{updateUserAdminError}</span>}
        </FormWrapper>

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button type="button" variant="surface" theme="muted" onClick={onClose} disabled={isUpdatingUserAdmin}>
              {t('views:userManagement.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="surface"
              theme={isAdmin ? 'danger' : 'muted'}
              disabled={isUpdatingUserAdmin}
              form="remove-admin-form"
            >
              {isUpdatingUserAdmin
                ? isAdmin
                  ? t('views:userManagement.removeAdmin.pending', 'Removing admin...')
                  : t('views:userManagement.grantAdmin.pending', 'Granting admin...')
                : isAdmin
                  ? t('views:userManagement.removeAdmin.confirm', 'Yes, remove admin')
                  : t('views:userManagement.grantAdmin.confirm', 'Yes, grant admin')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
