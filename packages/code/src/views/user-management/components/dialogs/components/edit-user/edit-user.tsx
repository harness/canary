import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button, ButtonLayout, Dialog, FormInput, FormWrapper, Text } from '@/components'
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
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="font-medium">{t('views:userManagement.editUser.title', 'Update user')}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <Text
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
            <FormInput.Text
              id="userID"
              disabled
              {...register('userID')}
              className="cursor-not-allowed"
              label={t('views:userManagement.userId', 'User ID')}
              caption={t('views:userManagement.userIdHint', 'User ID cannot be changed once created')}
            />

            <FormInput.Text
              id="email"
              type="email"
              {...register('email')}
              label={t('views:userManagement.editUser.email', 'Email')}
            />

            <FormInput.Text
              id="displayName"
              {...register('displayName')}
              label={t('views:userManagement.displayName', 'Display name')}
            />

            {updateUserError && (
              <Text as="span" color="danger">
                {updateUserError}
              </Text>
            )}
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={onClose} disabled={isUpdatingUser}>
              {t('views:userManagement.cancel', 'Cancel')}
            </Dialog.Close>
            <Button type="submit" form="edit-user-form" disabled={isUpdatingUser}>
              {isUpdatingUser
                ? t('views:userManagement.editUser.pending', 'Saving...')
                : t('views:userManagement.editUser.save', 'Save')}
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
