import { useState } from 'react'

import { Button, ButtonLayout, Dialog, Layout, Text, Textarea, ToggleGroup } from '@harnessio/ui/components'

import { EnumFeedbackReason, FeedbackReasonOption } from './types'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reasonOptions: FeedbackReasonOption[]
  onSubmit: (reasons: EnumFeedbackReason[], comment: string) => void
  isLoading?: boolean
}

export function FeedbackDialog({ open, onOpenChange, reasonOptions, onSubmit, isLoading }: FeedbackDialogProps) {
  const [selectedReasons, setSelectedReasons] = useState<EnumFeedbackReason[]>([])
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    onSubmit(selectedReasons, comment)
    setSelectedReasons([])
    setComment('')
  }

  const handleCancel = () => {
    setSelectedReasons([])
    setComment('')
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="overflow-hidden p-0" size="lg">
        <Dialog.Header className="p-cn-md pb-0">
          <Dialog.Title>Help make Harness AI better</Dialog.Title>
          <Dialog.Description>Tell us how we did:</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="p-cn-lg pt-0">
          <Layout.Vertical gap="md">
            <ToggleGroup.Root
              type="multiple"
              value={selectedReasons}
              onChange={(value: string[]) => setSelectedReasons(value as EnumFeedbackReason[])}
              className="flex flex-wrap gap-cn-sm"
            >
              {reasonOptions.map(option => (
                <ToggleGroup.Item key={option.value} value={option.value} text={option.label} />
              ))}
            </ToggleGroup.Root>

            <Layout.Vertical gap="xs">
              <Text variant="body-strong" color="foreground-1">
                Additional comments (Optional)
              </Text>
              <Textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Please add more details to help us improve the experience."
                className="min-h-[100px] resize-y"
              />
            </Layout.Vertical>
          </Layout.Vertical>
        </Dialog.Body>

        <Dialog.Footer className="p-cn-lg pt-cn-md">
          <ButtonLayout.Root className="mr-cn-md">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={isLoading}>
              Confirm
            </Button>
          </ButtonLayout.Root>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
