import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, ControlGroup, Dialog, Fieldset, FormWrapper, Input } from '@/components'
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
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()
  const { t } = useTranslationStore()
  const { user } = useAdminListUsersStore()

  const { loadingStates, errorStates } = useStates()
  const { isUpdatingUser } = loadingStates
  const { updateUserError } = errorStates

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditUserFields>({
    resolver: zodResolver(createEditUserSchema(t)),
    mode: 'onChange'
  })

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

        <FormWrapper onSubmit={handleSubmit(handleUpdateUser)}>
          <Fieldset>
            <ControlGroup>
              <Input
                id="userID"
                size="md"
                disabled
                {...register('userID')}
                className="cursor-not-allowed"
                label={t('views:userManagement.userId', 'User ID')}
                caption={t('views:userManagement.userIdHint', 'User ID cannot be changed once created')}
                error={errors.userID?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          <Fieldset>
            <ControlGroup>
              <Input
                id="email"
                size="md"
                {...register('email')}
                label={t('views:userManagement.editUser.email', 'Email')}
                error={errors.email?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          <Fieldset>
            <ControlGroup>
              <Input
                id="displayName"
                size="md"
                {...register('displayName')}
                label={t('views:userManagement.displayName', 'Display name')}
                error={errors.displayName?.message?.toString()}
              />
            </ControlGroup>
          </Fieldset>

          {updateUserError && <span className="text-xs text-destructive">{updateUserError}</span>}

          <Dialog.Footer>
            <ButtonGroup className="justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isUpdatingUser}>
                {t('views:userManagement.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={isUpdatingUser}>
                {isUpdatingUser
                  ? t('views:userManagement.editUser.pending', 'Saving...')
                  : t('views:userManagement.editUser.save', 'Save')}
              </Button>
            </ButtonGroup>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
