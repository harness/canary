import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@harnessio/canary'

import { SshKeyCreateForm, SshKeyFormType } from './ssh-key-create-form'

interface SshKeyCreateDialogProps {
  open: boolean
  onClose: () => void
  handleCreateSshKey: (data: SshKeyFormType) => void
  error: { type: string; message: string } | null
}

export const SshKeyCreateDialog: React.FC<SshKeyCreateDialogProps> = ({ open, onClose, handleCreateSshKey, error }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <DialogHeader>
          <DialogTitle className="text-left">New SSH key</DialogTitle>
        </DialogHeader>
        <SshKeyCreateForm handleCreateSshKey={handleCreateSshKey} onClose={onClose} error={error} />
      </DialogContent>
    </Dialog>
  )
}
