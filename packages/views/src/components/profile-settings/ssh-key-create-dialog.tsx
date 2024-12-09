import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@harnessio/canary'

import { SshKeyCreateForm } from './ssh-key-create-form'

interface SshKeyCreateDialogProps {
  open: boolean
  onClose: () => void
}

export const SshKeyCreateDialog: React.FC<SshKeyCreateDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle className="text-left">New SSH key</DialogTitle>
        </DialogHeader>
        <SshKeyCreateForm />
      </DialogContent>
    </Dialog>
  )
}
