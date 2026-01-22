import { Message } from './message'
import { ThreadListItemState } from './thread'

export interface StreamAdapter {
  stream(request: StreamRequest): AsyncIterable<StreamChunk>
}

export type StreamEvent =
  | {
      readonly type: 'part-start'
      readonly part: {
        readonly type: 'text' | 'assistant_thought'
        readonly parentId?: string
        readonly toolCallId?: string
        readonly toolName?: string
        readonly language?: string
      }
    }
  | {
      readonly type: 'text-delta'
      readonly delta: string
    }
  | {
      readonly type: 'part-finish'
    }
  | {
      readonly type: 'metadata'
      readonly conversationId?: string
      readonly interactionId?: string
      readonly title?: string
    }
  | {
      readonly type: 'error'
      readonly error: string
    }
  | {
      readonly type: 'capability_execution'
      readonly capabilityName: string
      readonly capabilityId: string
      readonly args: any
      readonly strategy?: 'queue' | 'parallel' | 'replace'
    }
  | {
      // Custom events - any other type
      readonly type: string
      readonly data?: any
      readonly parentId?: string
      [key: string]: any // Allow any additional properties
    }

export interface StreamRequest {
  messages: Message[]
  conversationId?: string
  signal?: AbortSignal
  config?: Record<string, unknown>
}

export interface StreamChunk {
  event: StreamEvent
}

export interface ThreadListLoadOptions {
  query?: string
  offset?: number
  limit?: number
  replace?: boolean // If true, clears existing threads before loading
  // Allow custom pagination params for flexibility
  [key: string]: any
}

export interface ThreadListAdapter {
  listThreads(): Promise<ThreadListItemState[]>

  loadThreads(options?: ThreadListLoadOptions): Promise<ThreadListItemState[]>

  loadThread(threadId: string): Promise<Message[]>

  createThread(initialMessage?: string): Promise<ThreadListItemState>

  deleteThread(threadId: string): Promise<void>

  updateThread(threadId: string, updates: Partial<ThreadListItemState>): Promise<void>
}
