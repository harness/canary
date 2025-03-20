import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, Dialog, Fieldset, FormWrapper, Input, Textarea } from '@/components'
import { ApiErrorType } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeValidationUtils } from '@utils/validation'
import { TranslationStore } from '@views/repo'
import { z } from 'zod'

interface ProfileSettingsKeysCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
  useTranslationStore: () => TranslationStore
}

export const makeKeyCreateFormSchema = (t: TranslationStore['t']) => {
  const { required, maxLength, specialSymbols, noSpaces } = makeValidationUtils(t)

  const sshName = t('views:profileSettings.sshKey.validation.name', 'Key name')

  return z.object({
    identifier: z
      .string()
      .trim()
      .nonempty(required(sshName))
      .max(...maxLength(100, sshName))
      .regex(...specialSymbols(sshName))
      .refine(...noSpaces(sshName)),
    content: z
      .string()
      .trim()
      .nonempty(required(t('views:profileSettings.sshKey.publicKey')))
  })
}

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
          <Dialog.Title>{t('views:profileSettings.sshKey.newSshKey', 'New SSH key')}</Dialog.Title>
        </Dialog.Header>

        <FormWrapper onSubmit={handleSubmit(handleCreateSshKey)}>
          <Fieldset legend="SSH key details">
            <Input
              id="identifier"
              size="md"
              {...register('identifier')}
              placeholder={t('views:profileSettings.sshKey.enterNamePlaceholder', 'Enter the name')}
              label={t('views:profileSettings.sshKey.newSshKey', 'New SSH key')}
              error={errors.identifier?.message?.toString()}
              autoFocus
            />
            <Textarea
              className="text-foreground-1"
              id="content"
              value={content}
              {...register('content')}
              label={t('views:profileSettings.sshKey.publicKey', 'Public key')}
              placeholder={t('views:profileSettings.sshKey.enterPublicKeyPlaceholder', 'Enter the public key')}
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
              {t('views:profileSettings.sshKey.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={!isValid}>
              {t('views:profileSettings.sshKey.save', 'Save')}
            </Button>
          </Dialog.Footer>
        </FormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
