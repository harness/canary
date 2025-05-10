import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Alert, Button, Dialog, Fieldset, FormInput, FormWrapper, Input, Textarea } from '@/components'
import { ApiErrorType } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

type SshKeyFormType = z.infer<typeof formSchema>

interface ProfileSettingsKeysCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
  useTranslationStore: () => TranslationStore
}

const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Please provide a name' }),
  content: z.string().min(1, { message: 'Please add the public key' })
})

export const ProfileSettingsKeysCreateDialog: FC<ProfileSettingsKeysCreateDialogProps> = ({
  open,
  onClose,
  handleCreateSshKey,
  useTranslationStore,
  error
}) => {
  const { t } = useTranslationStore()
  const formMethods = useForm<SshKeyFormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      content: ''
    }
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = formMethods

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
        <FormWrapper {...formMethods} onSubmit={handleSubmit(handleFormSubmit)}>
          <Fieldset>
            <FormInput.Text
              id="identifier"
              value={identifier}
              {...register('identifier')}
              placeholder={t('views:profileSettings.enterNamePlaceholder', 'Enter the name')}
              label={t('views:profileSettings.newSshKey', 'New SSH key')}
              autoFocus
            />
          </Fieldset>
          <Fieldset className="gap-y-0">
            <Textarea
              className="text-cn-foreground-1"
              id="content"
              value={content}
              {...register('content')}
              label={t('views:profileSettings.publicKey', 'Public key')}
              error={errors.content?.message?.toString()}
            />
          </Fieldset>
          {error?.type === ApiErrorType.KeyCreate && (
            <Alert.Container variant="destructive">
              <Alert.Title>{error.message}</Alert.Title>
            </Alert.Container>
          )}
          <Dialog.Footer className="-mx-5 -mb-5">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('views:profileSettings.cancel', 'Cancel')}
            </Button>
            <Button type="submit">{t('views:profileSettings.save', 'Save')}</Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
