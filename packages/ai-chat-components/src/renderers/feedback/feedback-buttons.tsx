import { Button, IconV2, Layout } from '@harnessio/ui/components'

interface FeedbackButtonsProps {
  onThumbsUp: () => void
  onThumbsDown: () => void
  disabled?: boolean
}

export function FeedbackButtons({ onThumbsUp, onThumbsDown, disabled }: FeedbackButtonsProps) {
  return (
    <Layout.Horizontal align="center" gap="none">
      <Button
        variant="transparent"
        size="sm"
        iconOnly
        tooltipProps={{ content: 'Helpful' }}
        onClick={onThumbsUp}
        disabled={disabled}
      >
        <IconV2 name="thumbs-up" size="sm" />
      </Button>
      <Button
        variant="transparent"
        size="sm"
        iconOnly
        tooltipProps={{ content: 'Not helpful' }}
        onClick={onThumbsDown}
        disabled={disabled}
      >
        <IconV2 name="thumbs-down" size="sm" />
      </Button>
    </Layout.Horizontal>
  )
}
