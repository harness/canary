import { FC } from 'react'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components'
import { TranslationStore } from '@views/repo'

import { TokenFormType } from '../../types'
import { ProfileSettingsTokenCreateForm } from './profile-settings-token-create-form'

interface ProfileSettingsTokenCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateToken: (data: TokenFormType) => void
  error: { type: string; message: string } | null
  isLoading: boolean
  useTranslationStore: () => TranslationStore
}

export const ProfileSettingsTokenCreateDialog: FC<ProfileSettingsTokenCreateDialogProps> = ({
  open,
  onClose,
  handleCreateToken,
  error,
  isLoading,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('views:profileSettings.createToken', 'Create a token')}</AlertDialogTitle>
        </AlertDialogHeader>
        <ProfileSettingsTokenCreateForm
          handleCreateToken={handleCreateToken}
          onClose={onClose}
          error={error}
          isLoading={isLoading}
          useTranslationStore={useTranslationStore}
        />
      </AlertDialogContent>
    </AlertDialog>
  )
}
