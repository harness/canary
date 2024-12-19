import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components'
import { IProfileSettingsStore } from '@views/profile-settings/types'

import { TokenSuccessForm } from './token-success-form'

interface TokenCreateDialogProps {
  open: boolean
  onClose: () => void
  useProfileSettingsStore: () => IProfileSettingsStore
}

export const TokenSuccessDialog: React.FC<TokenCreateDialogProps> = ({ open, onClose, useProfileSettingsStore }) => {
  const { createdTokenData } = useProfileSettingsStore()
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle className="text-left">Create a token</DialogTitle>
        </DialogHeader>
        <TokenSuccessForm defaultValues={createdTokenData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
