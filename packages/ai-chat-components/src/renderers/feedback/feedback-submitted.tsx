import { Button, IconV2, Layout, Text } from '@harnessio/ui/components'

import { EnumSentiment } from './types'

interface FeedbackSubmittedProps {
  sentiment: EnumSentiment
  onReset: () => void
}

export function FeedbackSubmitted({ sentiment, onReset }: FeedbackSubmittedProps) {
  return (
    <Layout.Horizontal gap="none" align="center">
      <Button
        variant="transparent"
        size="sm"
        iconOnly
        tooltipProps={{ content: 'Click to change feedback' }}
        onClick={onReset}
      >
        <IconV2
          name={sentiment === 'positive' ? 'thumbs-up' : 'thumbs-down'}
          size="sm"
          color={sentiment === 'positive' ? 'success' : 'neutral'}
        />
      </Button>
      <Text variant="caption-normal" color="foreground-3">
        Thanks for your feedback!
      </Text>
    </Layout.Horizontal>
  )
}
