import { Message } from '@harnessio/ai-chat-core'
import { createContext, useContext } from 'react'

import { EnumFeedbackReason } from './types'
import { FeedbackWidget } from './feedback-widget'

export interface FeedbackContent {
  type: 'feedback'
  data: {
    conversation_id?: string
    interaction_id?: string
    session_id?: string
  }
}

export interface FeedbackHandler {
  onSubmitPositive: (feedbackData: { conversationId: string; interactionId: string; sessionId: string }) => void
  onSubmitNegative: (
    feedbackData: { conversationId: string; interactionId: string; sessionId: string },
    reasons: EnumFeedbackReason[],
    comment: string
  ) => void
  isLoading?: boolean
}

const defaultHandler: FeedbackHandler = {
  onSubmitPositive: () => {},
  onSubmitNegative: () => {}
}

export const FeedbackHandlerContext = createContext<FeedbackHandler>(defaultHandler)

export function useFeedbackHandler() {
  return useContext(FeedbackHandlerContext)
}

interface FeedbackContentRendererProps {
  message: Message
  content: FeedbackContent
}

export function FeedbackContentRenderer({ message, content }: FeedbackContentRendererProps) {
  const handler = useFeedbackHandler()

  const feedbackData = {
    conversationId: content.data.conversation_id || '',
    interactionId: content.data.interaction_id || message.metadata?.interactionId || '',
    sessionId: content.data.session_id || ''
  }

  return (
    <FeedbackWidget
      onSubmitPositive={() => handler.onSubmitPositive(feedbackData)}
      onSubmitNegative={(reasons, comment) => handler.onSubmitNegative(feedbackData, reasons, comment)}
      isLoading={handler.isLoading}
    />
  )
}
