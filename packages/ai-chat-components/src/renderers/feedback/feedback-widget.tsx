import { useState } from 'react'

import { FeedbackButtons } from './feedback-buttons'
import { FeedbackDialog } from './feedback-dialog'
import { FeedbackSubmitted } from './feedback-submitted'
import { EnumFeedbackReason, EnumSentiment, FEEDBACK_REASON_OPTIONS } from './types'

export interface FeedbackWidgetProps {
  onSubmitPositive: () => void
  onSubmitNegative: (reasons: EnumFeedbackReason[], comment: string) => void
  isLoading?: boolean
  onFeedbackSubmitted?: (sentiment: EnumSentiment) => void
}

export function FeedbackWidget({
  onSubmitPositive,
  onSubmitNegative,
  isLoading,
  onFeedbackSubmitted
}: FeedbackWidgetProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submittedSentiment, setSubmittedSentiment] = useState<EnumSentiment | null>(null)

  const handlePositive = () => {
    onSubmitPositive()
    setSubmittedSentiment('positive')
    onFeedbackSubmitted?.('positive')
  }

  const handleNegative = (reasons: EnumFeedbackReason[], comment: string) => {
    onSubmitNegative(reasons, comment)
    setSubmittedSentiment('negative')
    setIsDialogOpen(false)
    onFeedbackSubmitted?.('negative')
  }

  const reset = () => {
    setSubmittedSentiment(null)
  }

  if (submittedSentiment) {
    return <FeedbackSubmitted sentiment={submittedSentiment} onReset={reset} />
  }

  return (
    <div className="top-cn-xs">
      <FeedbackButtons
        onThumbsUp={handlePositive}
        onThumbsDown={() => setIsDialogOpen(true)}
        disabled={isLoading}
      />
      <FeedbackDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reasonOptions={FEEDBACK_REASON_OPTIONS}
        onSubmit={handleNegative}
        isLoading={isLoading}
      />
    </div>
  )
}
