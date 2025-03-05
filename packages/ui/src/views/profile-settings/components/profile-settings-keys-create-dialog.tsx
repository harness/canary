import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, Dialog, Fieldset, FormWrapper, Input, Textarea } from '@/components'
import { ApiErrorType } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

interface ProfileSettingsKeysCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
  useTranslationStore: () => TranslationStore
}

export const makeKeyCreateFormSchema = (t: TranslationStore['t']) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .nonempty({ message: t('views:profileSettings.sshKeyValidation.nameMin', 'Please provide key name') })
      .max(100, {
        message: t('views:profileSettings.sshKeyValidation.nameMax', 'Name must be no longer than 100 characters')
      })
      .regex(/^[a-zA-Z0-9._-\s]+$/, {
        message: t(
          'views:profileSettings.sshKeyValidation.nameRegex',
          'Name must contain only letters, numbers, and the characters: - _ .'
        )
      })
      .refine(data => !data.includes(' '), {
        message: t('views:profileSettings.sshKeyValidation.noSpaces', 'Name cannot contain spaces')
      }),
    content: z
      .string()
      .trim()
      .min(1, { message: t('views:profileSettings.sshKeyValidation.expiration', 'Please add the public key') })
  })

type SshKeyFormType = z.infer<ReturnType<typeof makeKeyCreateFormSchema>>

export const ProfileSettingsKeysCreateDialog: FC<ProfileSettingsKeysCreateDialogProps> = ({
  open,
  onClose,
  handleCreateSshKey,
  useTranslationStore,
  error
}) => {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<SshKeyFormType>({
    resolver: zodResolver(makeKeyCreateFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      content: ''
    }
  })

  const content = watch('content')

  useEffect(() => {
    !open && reset()
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>{t('views:profileSettings.newSshKey', 'New SSH key')}</Dialog.Title>
        </Dialog.Header>

        <FormWrapper onSubmit={handleSubmit(handleCreateSshKey)}>
          <Fieldset legend="SSH key details">
            <Input
              id="identifier"
              size="md"
              {...register('identifier')}
              placeholder={t('views:profileSettings.enterNamePlaceholder', 'Enter the name')}
              label={t('views:profileSettings.newSshKey', 'New SSH key')}
              error={errors.identifier?.message?.toString()}
              autoFocus
            />
            <Textarea
              className="text-foreground-1"
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
            <Button type="submit" disabled={!isValid}>
              {t('views:profileSettings.save', 'Save')}
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
