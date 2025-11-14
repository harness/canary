import { Message, MessageContent } from './message'
import { ThreadListItemState } from './thread'

export interface StreamAdapter {
  stream(params: {
    messages: Message[]
    signal?: AbortSignal
    config?: Record<string, unknown>
  }): AsyncGenerator<MessageContent, void, unknown>
}

export interface ThreadListAdapter {
  listThreads(): Promise<ThreadListItemState[]>

  loadThread(threadId: string): Promise<Message[]>

  createThread(initialMessage?: string): Promise<ThreadListItemState>

  deleteThread(threadId: string): Promise<void>

  updateThread(threadId: string, updates: Partial<ThreadListItemState>): Promise<void>
}
