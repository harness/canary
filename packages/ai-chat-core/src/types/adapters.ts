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
    }
  | {
      readonly type: 'error'
      readonly error: string
    }
  | {
      // Custom events - any other type
      readonly type: string
      readonly data?: any
      readonly parentId?: string
      [key: string]: any  // Allow any additional properties
    }

export interface StreamRequest {
  messages: Message[]
  signal?: AbortSignal
  config?: Record<string, unknown>
}

export interface StreamChunk {
  event: StreamEvent
}

export interface ThreadListAdapter {
  listThreads(): Promise<ThreadListItemState[]>

  loadThread(threadId: string): Promise<Message[]>

  createThread(initialMessage?: string): Promise<ThreadListItemState>

  deleteThread(threadId: string): Promise<void>

  updateThread(threadId: string, updates: Partial<ThreadListItemState>): Promise<void>
}
