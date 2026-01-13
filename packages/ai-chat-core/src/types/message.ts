export type MessageRole = 'user' | 'assistant'

export type MessageStatus =
  | { type: 'pending' }
  | { type: 'running' }
  | { type: 'complete' }
  | { type: 'error'; error: string }
  | { type: 'cancelled' }

export type ContentStatus = { type: 'streaming' } | { type: 'complete' } | { type: 'error'; error: string }

export interface MessageMetadata {
  interactionId?: string
  conversationId?: string
  [key: string]: string | number | boolean | undefined
}

export interface Message {
  id: string
  parentId?: string
  role: MessageRole
  content: MessageContent[]
  status: MessageStatus
  timestamp: number
  metadata?: MessageMetadata
}

export interface TextContent extends MessageContent<string> {
  type: 'text'
}

export interface ErrorContent extends MessageContent<string> {
  type: 'error'
}

export interface MetadataContent extends MessageContent {
  type: 'metadata'
  conversationId?: string
  interactionId?: string
}

export interface AssistantThoughtContent extends MessageContent {
  type: 'assistant_thought'
  text: string
}

export interface CustomContent extends MessageContent {
  type: string
  data: Record<string, unknown>
}

export interface MessageContent<T = any> {
  type: string
  parentId?: string
  data?: T
  status?: ContentStatus
}

export type AppendMessage = Omit<Message, 'id' | 'timestamp' | 'status'> & {
  id?: string
  timestamp?: number
  status?: MessageStatus
}
