import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components'
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

export const TokenCreateDialog: React.FC<TokenCreateDialogProps> = ({
  open,
  onClose,
  handleCreateToken,
  error,
  isLoading,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-left">{t('views:profileSettings.createToken', 'Create a token')}</DialogTitle>
        </DialogHeader>
        <TokenCreateForm
          handleCreateToken={handleCreateToken}
          onClose={onClose}
          error={error}
          isLoading={isLoading}
          useTranslationStore={useTranslationStore}
        />
      </DialogContent>
    </Dialog>
  )
}
