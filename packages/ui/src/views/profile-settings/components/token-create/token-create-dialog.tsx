import { FC } from 'react'

import { Dialog } from '@/components'
import { TranslationStore } from '@views/repo'

import { TokenFormType } from '../../types'
import { TokenCreateForm } from './token-create-form'

interface TokenCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateToken: (data: TokenFormType) => void
  error: { type: string; message: string } | null
  isLoading: boolean
  useTranslationStore: () => TranslationStore
}

export const TokenCreateDialog: FC<TokenCreateDialogProps> = ({
  open,
  onClose,
  handleCreateToken,
  error,
  isLoading,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title className="text-left">{t('views:profileSettings.createToken', 'Create a token')}</Dialog.Title>
        </Dialog.Header>
        <TokenCreateForm
          handleCreateToken={handleCreateToken}
          onClose={onClose}
          error={error}
          isLoading={isLoading}
          useTranslationStore={useTranslationStore}
        />
      </Dialog.Content>
    </Dialog.Root>
  )
}
