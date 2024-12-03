import { Dialog, DialogContent } from '@harnessio/canary'

import RunPipelineForm, { RunPipelineFormProps } from './run-pipeline-form'

interface RunPipelineDialogProps extends RunPipelineFormProps {
  open: boolean
  onClose: () => void
}

export default function RunPipelineDialog({ onClose, open, ...rest }: RunPipelineDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-[500px] border-border bg-primary-background">
        <RunPipelineForm {...rest} requestClose={() => onClose()} />
      </DialogContent>
    </Dialog>
  )
}
