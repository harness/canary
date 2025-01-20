import { FC } from 'react'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components'
import { TranslationStore } from '@views/repo'

import { ProfileSettingsKeysCreateForm, SshKeyFormType } from './profile-settings-keys-create-form'

interface ProfileSettingsKeysCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
  useTranslationStore: () => TranslationStore
}

export const ProfileSettingsKeysCreateDialog: FC<ProfileSettingsKeysCreateDialogProps> = ({
  open,
  onClose,
  handleCreateSshKey,
  useTranslationStore,
  error
}) => {
  const { t } = useTranslationStore()
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('views:profileSettings.newSshKey', 'New SSH key')}</AlertDialogTitle>
        </AlertDialogHeader>
        <ProfileSettingsKeysCreateForm
          handleCreateSshKey={handleCreateSshKey}
          onClose={onClose}
          useTranslationStore={useTranslationStore}
          error={error}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}
