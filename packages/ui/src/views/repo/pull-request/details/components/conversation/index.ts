// Base components
export { TimelineItem, type TimelineItemProps } from './timeline-item'
export { CommentHeader, type CommentHeaderProps, type CommentAction } from './comment-header'
export { CommentContent, type CommentContentProps } from './comment-content'
export { CommentReplyBox, type CommentReplyBoxProps } from './comment-reply-box'
export { ConversationManager, type ConversationManagerProps } from './conversation-manager'

// State management
export { useCommentState, type CommentState, type UseCommentStateOptions } from './use-comment-state'

// Main components
export { CommentThread, type CommentThreadProps, type CommentData } from './comment-thread'

// Specialized variants
export { PRDescriptionBox, type PRDescriptionBoxProps } from './pr-description-box'
export { SystemCommentItem, type SystemCommentItemProps } from './system-comment-item'

// Utilities (re-export existing)
export { replaceEmailAsKey, replaceMentionEmailWithId, replaceMentionIdWithEmail } from './utils'

// Legacy component (for backward compatibility during migration)
export {
  default as PullRequestTimelineItem,
  type TimelineItemProps as LegacyTimelineItemProps
} from './pull-request-timeline-item'
