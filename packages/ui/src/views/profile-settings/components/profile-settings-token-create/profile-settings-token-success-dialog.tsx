import { FC } from 'react'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components'
import { IProfileSettingsStore } from '@views/profile-settings/types'
import { TranslationStore } from '@views/repo'

import { ProfileSettingsTokenSuccessForm } from './profile-settings-token-success-form'

interface ProfileSettingsTokenSuccessDialogProps {
  open: boolean
  onClose: () => void
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
}

export const ProfileSettingsTokenSuccessDialog: FC<ProfileSettingsTokenSuccessDialogProps> = ({
  open,
  onClose,
  useProfileSettingsStore,
  useTranslationStore
}) => {
  const { createdTokenData } = useProfileSettingsStore()
  const { t } = useTranslationStore()
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('views:profileSettings.createToken', 'Create a token')}</AlertDialogTitle>
        </AlertDialogHeader>
        <ProfileSettingsTokenSuccessForm
          defaultValues={createdTokenData}
          onClose={onClose}
          useTranslationStore={useTranslationStore}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}
