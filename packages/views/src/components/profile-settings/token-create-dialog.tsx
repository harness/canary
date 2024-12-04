import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@harnessio/canary'

import { TokenCreateForm } from './token-create-form'

interface TokenCreateDialogProps {
  open: boolean
  onClose: () => void
}

export const TokenCreateDialog: React.FC<TokenCreateDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-primary-background border-border max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-left">Create a token</DialogTitle>
        </DialogHeader>
        <TokenCreateForm />
      </DialogContent>
    </Dialog>
  )
}
