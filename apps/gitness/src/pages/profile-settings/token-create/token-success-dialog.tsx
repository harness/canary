import React from 'react'
import { TokenSuccessForm } from './token-success-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@harnessio/canary'

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
      <DialogContent className="max-w-[500px]  bg-primary-background border-border">
        <DialogHeader>
          <DialogTitle className="text-left">Create a token</DialogTitle>
        </DialogHeader>
        <TokenSuccessForm defaultValues={tokenData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
