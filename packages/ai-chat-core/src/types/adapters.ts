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
      readonly status?: 'executing' | 'waiting_for_user' | 'waiting_for_confirmation' | 'completed'
      readonly strategy?: 'queue' | 'parallel' | 'replace'
    }
  | {
      // Custom events - any other type
      readonly type: string
      readonly data?: any
      readonly parentId?: string
      [key: string]: any // Allow any additional properties
    }

export type SystemEventType =
  // HITL responses to an elicitation card (Accept / Deny). These resume the
  // agent so it can continue the task.
  | 'action_completed'
  | 'action_cancelled'
  // Sideband/background status update driven by a UI task (e.g. a card polling
  // an execution status API). The backend acknowledges non-terminal updates
  // without waking the agent and resumes it on terminal states.
  | 'pipeline_status_updated'

export interface SystemEvent {
  event_type: SystemEventType
  capability_id: string
  // Event payload. `success` applies to HITL action results; background/status
  // events carry arbitrary fields (e.g. { source, status, terminal }), so
  // `success` is optional and additional keys are allowed.
  result?: { success?: boolean; [key: string]: unknown }
  target_page_id?: string
}

export interface StreamRequest {
  messages: Message[]
  conversationId?: string
  signal?: AbortSignal
  config?: Record<string, unknown>
  systemEvent?: SystemEvent
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
