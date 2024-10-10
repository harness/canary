import { SshKeyCreateForm } from './ssh-key-create-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@harnessio/canary'
import React from 'react'

interface SshKeyCreateDialogProps {
  open: boolean
  onClose: () => void
}

export const SshKeyCreateDialog: React.FC<SshKeyCreateDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px]  bg-primary-background border-border">
        <DialogHeader>
          <DialogTitle className="text-left">New SSH key</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <SshKeyCreateForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
