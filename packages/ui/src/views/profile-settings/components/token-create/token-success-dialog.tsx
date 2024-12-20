import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components'
import { IProfileSettingsStore } from '@views/profile-settings/types'
import { TranslationStore } from '@views/repo'

import { TokenSuccessForm } from './token-success-form'

interface TokenCreateDialogProps {
  open: boolean
  onClose: () => void
  useProfileSettingsStore: () => IProfileSettingsStore
  useTranslationStore: () => TranslationStore
}

export const TokenSuccessDialog: React.FC<TokenCreateDialogProps> = ({
  open,
  onClose,
  useProfileSettingsStore,
  useTranslationStore
}) => {
  const { createdTokenData } = useProfileSettingsStore()
  const { t } = useTranslationStore()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle className="text-left">{t('views:profileSettings.createToken', 'Create a token')}</DialogTitle>
        </DialogHeader>
        <TokenSuccessForm
          defaultValues={createdTokenData}
          onClose={onClose}
          useTranslationStore={useTranslationStore}
        />
      </DialogContent>
    </Dialog>
  )
}
