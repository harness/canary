import { FC } from 'react'

import { Dialog } from '@/components'
import { IProfileSettingsStore } from '@views/profile-settings/types'
import { TranslationStore } from '@views/repo'

import { TokenSuccessForm } from './token-success-form'

interface TokenCreateDialogProps {
  open: boolean
  onClose: () => void
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
}

export const TokenSuccessDialog: FC<TokenCreateDialogProps> = ({
  open,
  onClose,
  useProfileSettingsStore,
  useTranslationStore
}) => {
  const { createdTokenData } = useProfileSettingsStore()
  const { t } = useTranslationStore()
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title className="text-left">{t('views:profileSettings.createToken', 'Create a token')}</Dialog.Title>
        </Dialog.Header>
        <TokenSuccessForm
          defaultValues={createdTokenData}
          onClose={onClose}
          useTranslationStore={useTranslationStore}
        />
      </Dialog.Content>
    </Dialog.Root>
  )
}
