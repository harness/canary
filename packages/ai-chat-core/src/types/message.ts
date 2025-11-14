export type MessageRole = 'user' | 'assistant'

export type MessageStatus =
  | { type: 'pending' }
  | { type: 'running' }
  | { type: 'complete' }
  | { type: 'error'; error: string }
  | { type: 'cancelled' }

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

export interface TextContent extends MessageContent {
  type: 'text'
  text: string
}

export interface ErrorContent extends MessageContent {
  type: 'error'
  error: string
}

export interface MetadataContent extends MessageContent {
  type: 'metadata'
  conversationId?: string
  interactionId?: string
}

export interface CustomContent extends MessageContent {
  type: string
  data: Record<string, unknown>
}

export interface MessageContent {
  type: string
}

export type AppendMessage = Omit<Message, 'id' | 'timestamp' | 'status'> & {
  id?: string
  timestamp?: number
  status?: MessageStatus
}
