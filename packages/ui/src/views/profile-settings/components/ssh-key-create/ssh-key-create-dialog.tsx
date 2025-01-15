import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components'
import { TranslationStore } from '@views/repo'

import { SshKeyCreateForm, SshKeyFormType } from './ssh-key-create-form'

interface SshKeyCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
  useTranslationStore: () => TranslationStore
}

export const SshKeyCreateDialog: React.FC<SshKeyCreateDialogProps> = ({
  open,
  onClose,
  handleCreateSshKey,
  useTranslationStore,
  error
}) => {
  const { t } = useTranslationStore()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-left">{t('views:profileSettings.newSshKey', 'New SSH key')}</DialogTitle>
        </DialogHeader>
        <SshKeyCreateForm
          handleCreateSshKey={handleCreateSshKey}
          onClose={onClose}
          useTranslationStore={useTranslationStore}
          error={error}
        />
      </DialogContent>
    </Dialog>
  )
}
