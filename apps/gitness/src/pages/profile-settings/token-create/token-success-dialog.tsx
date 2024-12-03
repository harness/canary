import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@harnessio/canary'

import { TokenSuccessForm } from './token-success-form'

interface TokenCreateDialogProps {
  open: boolean
  onClose: () => void
  tokenData: {
    identifier: string
    lifetime: string
    token: string
  }
}

export const TokenSuccessDialog: React.FC<TokenCreateDialogProps> = ({ open, onClose, tokenData }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle className="text-left">Create a token</DialogTitle>
        </DialogHeader>
        <TokenSuccessForm defaultValues={tokenData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
