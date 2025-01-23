import { FC } from 'react'

import { Dialog } from '@/components'
import { TranslationStore } from '@views/repo'

import { SshKeyCreateForm, SshKeyFormType } from './ssh-key-create-form'

interface SshKeyCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
  useTranslationStore: () => TranslationStore
}

export const SshKeyCreateDialog: FC<SshKeyCreateDialogProps> = ({
  open,
  onClose,
  handleCreateSshKey,
  useTranslationStore,
  error
}) => {
  const { t } = useTranslationStore()
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title className="text-left">{t('views:profileSettings.newSshKey', 'New SSH key')}</Dialog.Title>
        </Dialog.Header>
        <SshKeyCreateForm
          handleCreateSshKey={handleCreateSshKey}
          onClose={onClose}
          useTranslationStore={useTranslationStore}
          error={error}
        />
      </Dialog.Content>
    </Dialog.Root>
  )
}
