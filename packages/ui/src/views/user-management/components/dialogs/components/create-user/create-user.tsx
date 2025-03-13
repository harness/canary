import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, Dialog, Fieldset, FormWrapper, Input } from '@/components'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createNewUserSchema,
  NewUserFields
} from '@views/user-management/components/dialogs/components/create-user/schema'

interface CreateUserDialogProps {
  handleCreateUser: (data: NewUserFields) => void
  open: boolean
  onClose: () => void
}

export function CreateUserDialog({ handleCreateUser, open, onClose }: CreateUserDialogProps) {
  const { useTranslationStore } = useUserManagementStore()
  const { t } = useTranslationStore()

  const { loadingStates, errorStates } = useStates()
  const { isCreatingUser } = loadingStates
  const { createUserError } = errorStates

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewUserFields>({
    resolver: zodResolver(createNewUserSchema(t)),
    mode: 'onChange',
    defaultValues: { uid: '', email: '', display_name: '' }
  })

  const onSubmit: SubmitHandler<NewUserFields> = data => {
    handleCreateUser(data)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title className="font-medium">
            {t('views:userManagement.createUser.title', 'Add a new user')}
          </Dialog.Title>
        </Dialog.Header>

        <FormWrapper onSubmit={handleSubmit(onSubmit)} id="create-user-form">
          <Fieldset>
            <Input
              id="memberName"
              size="md"
              {...register('uid')}
              label={t('views:userManagement.userId', 'User ID')}
              caption={t('views:userManagement.userIdHint', 'User ID cannot be changed once created')}
              placeholder={t('views:userManagement.enterName', 'Enter name')}
              error={errors.uid?.message?.toString()}
            />

            <Input
              id="email"
              type="email"
              size="md"
              {...register('email')}
              placeholder={t('views:userManagement.enterEmail', 'Enter email address')}
              label={t('views:userManagement.email', 'Email')}
              error={errors.email?.message?.toString()}
            />

            <Input
              id="displayName"
              size="md"
              {...register('display_name')}
              placeholder={t('views:userManagement.createUser.enterDisplayName', 'Enter display name')}
              label={t('views:userManagement.displayName', 'Display name')}
              error={errors.display_name?.message?.toString()}
            />
          </Fieldset>

          {createUserError && <span className="text-xs text-destructive">{createUserError}</span>}
        </FormWrapper>

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button variant="outline" type="button" onClick={onClose} disabled={isCreatingUser}>
              {t('views:userManagement.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isCreatingUser} form="create-user-form">
              {isCreatingUser
                ? t('views:userManagement.createUser.inviting', 'Inviting...')
                : t('views:userManagement.createUser.inviteNewUser', 'Invite new user')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
