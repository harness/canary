export type ThreadListItemStatus = { type: 'regular' } | { type: 'deleted' }

export interface RuntimeCapabilities {
  cancel: boolean
  edit: boolean
  reload: boolean
  speech: boolean
  attachments: boolean
  feedback: boolean
}

export interface ThreadState {
  threadId: string
  isDisabled: boolean
  isRunning: boolean
  capabilities: RuntimeCapabilities
}

export interface ThreadListItemState {
  id: string
  conversationId?: string
  externalId?: string
  title?: string
  status: ThreadListItemStatus
  isMain: boolean
  createdAt: number
  updatedAt: number
  lastMessage?: string
  messageCount?: number
}
