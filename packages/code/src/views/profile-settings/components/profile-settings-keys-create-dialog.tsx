import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { ApiErrorType } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Alert, Button, ButtonLayout, Dialog, FormInput, FormWrapper } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

type SshKeyFormType = z.infer<typeof formSchema>

interface ProfileSettingsKeysCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
}

const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a name' }),
  content: z.string().min(1, { message: 'Please add the public key' })
})

export const ProfileSettingsKeysCreateDialog: FC<ProfileSettingsKeysCreateDialogProps> = ({
  open,
  onClose,
  handleCreateSshKey,
  error
}) => {
  const { t } = useTranslation()
  const formMethods = useForm<SshKeyFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      content: ''
    }
  })

  const { register, handleSubmit, watch, reset } = formMethods

  const content = watch('content')
  const identifier = watch('identifier')

  useEffect(() => {
    !open && reset()
  }, [open, reset])

  const handleFormSubmit: SubmitHandler<SshKeyFormType> = data => {
    handleCreateSshKey(data)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:profileSettings.newSshKey', 'New SSH key')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <FormWrapper id="ssh-key-form" {...formMethods} onSubmit={handleSubmit(handleFormSubmit)}>
            <FormInput.Text
              id="identifier"
              value={identifier}
              {...register('identifier')}
              placeholder={t('views:profileSettings.enterNamePlaceholder', 'Enter the name')}
              label={t('views:profileSettings.newSshKey', 'New SSH key')}
              autoFocus
            />
            <FormInput.Textarea
              id="content"
              value={content}
              {...register('content')}
              label={t('views:profileSettings.publicKey', 'Public key')}
            />
            {error?.type === ApiErrorType.KeyCreate && (
              <Alert.Root theme="danger">
                <Alert.Title>{error.message}</Alert.Title>
              </Alert.Root>
            )}
          </FormWrapper>
        </Dialog.Body>
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={onClose}>{t('views:profileSettings.cancel', 'Cancel')}</Dialog.Close>
            <Button type="submit" form="ssh-key-form">
              {t('views:profileSettings.save', 'Save')}
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
