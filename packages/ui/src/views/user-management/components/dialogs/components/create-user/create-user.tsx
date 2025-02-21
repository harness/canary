import { SubmitHandler, useForm } from 'react-hook-form'

import { Button, ButtonGroup, Dialog, Input } from '@/components'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'
import { zodResolver } from '@hookform/resolvers/zod'

import { newUserSchema } from './schemas'
import { ICreateUserDialogProps, NewUserFields } from './types'

export function CreateUserDialog({ handleCreateUser, open, onClose }: ICreateUserDialogProps) {
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
    resolver: zodResolver(newUserSchema),
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
          <Dialog.Title className="font-medium">{t('views:userManagement.addNewUser', 'Add a new user')}</Dialog.Title>
        </Dialog.Header>

        <div className="flex flex-col gap-y-7">
          <Input
            id="memberName"
            size="md"
            {...register('uid')}
            label={t('views:userManagement.userId', 'User ID')}
            caption={t('views:userManagement.userIdHint', 'User ID cannot be changed once created')}
            placeholder={t('views:userManagement.enterUsername', 'Enter user name')}
            error={errors.uid?.message?.toString()}
          />

          <Input
            id="email"
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
            placeholder={t('views:userManagement.enterDisplayName', 'Enter display name')}
            label={t('views:userManagement.displayName', 'Display name')}
            error={errors.display_name?.message?.toString()}
          />

          {createUserError && <span className="text-xs text-destructive">{createUserError}</span>}
        </div>

        <Dialog.Footer>
          <ButtonGroup className="justify-end">
            <Button variant="outline" type="button" onClick={onClose} disabled={isCreatingUser}>
              {t('views:userManagement.cancel', 'Cancel')}
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isCreatingUser}>
              {isCreatingUser
                ? t('views:userManagement.inviting', 'Inviting...')
                : t('views:userManagement.inviteNewUser', 'Invite new user')}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
