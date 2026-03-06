export type EnumFeedbackReason =
  | 'did_not_fully_follow_instructions'
  | 'incorrect_yaml'
  | 'performance_issues'
  | 'response_not_accurate'
  | 'response_was_not_helpful'

export type EnumSentiment = 'negative' | 'positive'

export interface FeedbackReasonOption {
  value: EnumFeedbackReason
  label: string
}

export const FEEDBACK_REASON_OPTIONS: FeedbackReasonOption[] = [
  { value: 'did_not_fully_follow_instructions', label: 'Did not fully follow instructions' },
  { value: 'incorrect_yaml', label: 'Incorrect YAML' },
  { value: 'performance_issues', label: 'Performance issues' },
  { value: 'response_not_accurate', label: 'Response not accurate' },
  { value: 'response_was_not_helpful', label: 'Response was not helpful' }
]

export interface FeedbackContent {
  type: 'feedback'
  data: {
    conversation_id?: string
    interaction_id?: string
    session_id?: string
  }
}
