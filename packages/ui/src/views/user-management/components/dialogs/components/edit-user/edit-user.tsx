import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, Dialog, Fieldset, FormInput, FormWrapper } from '@/components'
import { useTranslation } from '@/context'
import {
  createEditUserSchema,
  type EditUserFields
} from '@/views/user-management/components/dialogs/components/edit-user/schema'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStates } from '@views/user-management/providers/state-provider'

interface EditUserDialogProps {
  handleUpdateUser: (data: EditUserFields) => void
  open: boolean
  onClose: () => void
}

export function EditUserDialog({ handleUpdateUser, open, onClose }: EditUserDialogProps) {
  const { useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslation()
  const { user } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isUpdatingUser } = loadingStates
  const { updateUserError } = errorStates

  const formMethods = useForm<EditUserFields>({
    resolver: zodResolver(createEditUserSchema(t)),
    mode: 'onChange'
  })

  const { register, handleSubmit, reset } = formMethods

  useEffect(() => {
    if (user) {
      reset({
        userID: user.uid,
        email: user.email,
        displayName: user.display_name
      })
    }
  }, [user, reset])

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">{t('views:userManagement.editUser.title', 'Update user')}</Dialog.Title>
        </Dialog.Header>

        <span
          dangerouslySetInnerHTML={{
            __html: t(
              'views:userManagement.editUser.message',
              'Update information for <strong>{{name}}</strong> and confirm changes.',
              {
                name: user?.display_name
              }
            )
          }}
        />

        <FormWrapper {...formMethods} onSubmit={handleSubmit(handleUpdateUser)} id="edit-user-form">
          <Fieldset>
            <FormInput.Text
              id="userID"
              disabled
              {...register('userID')}
              className="cursor-not-allowed"
              label={t('views:userManagement.userId', 'User ID')}
              caption={t('views:userManagement.userIdHint', 'User ID cannot be changed once created')}
            />
          </Fieldset>

          <Fieldset>
            <FormInput.Text
              id="email"
              type="email"
              {...register('email')}
              label={t('views:userManagement.editUser.email', 'Email')}
            />
          </Fieldset>

          <Fieldset>
            <FormInput.Text
              id="displayName"
              {...register('displayName')}
              label={t('views:userManagement.displayName', 'Display name')}
            />
          </Fieldset>

          {updateUserError && <span className="text-2 text-cn-foreground-danger">{updateUserError}</span>}
        </FormWrapper>
        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUpdatingUser}>
              {t('views:userManagement.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isUpdatingUser} form="edit-user-form">
              {isUpdatingUser
                ? t('views:userManagement.editUser.pending', 'Saving...')
                : t('views:userManagement.editUser.save', 'Save')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
