import { CapabilityExecutionManager } from '../../core'
import { CapabilityContent } from '../../types'
import { StreamAdapter, StreamEvent } from '../../types/adapters'
import { AppendMessage, Message, MessageContent, MessageStatus } from '../../types/message'
import { RuntimeCapabilities } from '../../types/thread'
import { generateMessageId } from '../../utils/idGenerator'
import { BaseSubscribable } from '../../utils/Subscribable'

export interface ThreadRuntimeCoreConfig {
  streamAdapter: StreamAdapter
  initialMessages?: Message[]
  onMessagesChange?: (messages: Message[]) => void
  capabilityExecutionManager?: CapabilityExecutionManager
}

export class ThreadRuntimeCore extends BaseSubscribable {
  private _messages: Message[] = []
  private _isRunning = false
  private _isDisabled = false
  private _abortController: AbortController | null = null

  // Track current part being accumulated
  private _currentPart: {
    messageId: string
    contentIndex: number
    type: string
    parentId?: string
  } | null = null

  constructor(private config: ThreadRuntimeCoreConfig) {
    super()
    if (config.initialMessages) {
      this._messages = [...config.initialMessages]
    }
  }

  public get messages(): readonly Message[] {
    return this._messages
  }

  public get isRunning(): boolean {
    return this._isRunning
  }

  public get isDisabled(): boolean {
    return this._isDisabled
  }

  public get capabilities(): RuntimeCapabilities {
    return {
      cancel: true,
      edit: false,
      reload: false,
      speech: false,
      attachments: false,
      feedback: false
    }
  }

  private updateMessages(messages: Message[]): void {
    this._messages = messages
    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()
  }

  public append(message: AppendMessage): void {
    const newMessage: Message = {
      id: message.id || generateMessageId(),
      parentId: message.parentId,
      role: message.role,
      content: message.content,
      status: message.status || { type: 'complete' },
      timestamp: message.timestamp || Date.now(),
      metadata: message.metadata
    }

    this.updateMessages([...this._messages, newMessage])
  }

  public async startRun(userMessage: AppendMessage): Promise<void> {
    if (this._isRunning) {
      throw new Error('A run is already in progress')
    }

    this.append(userMessage)
    this._isRunning = true
    this._abortController = new AbortController()
    this._currentPart = null // Reset current part

    const assistantMessageId = generateMessageId()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: [],
      status: { type: 'running' },
      timestamp: Date.now()
    }

    this.updateMessages([...this._messages, assistantMessage])

    try {
      const stream = this.config.streamAdapter.stream({
        messages: this._messages,
        signal: this._abortController.signal
      })

      for await (const event of stream) {
        if (this._abortController.signal.aborted) {
          break
        }

        this.handleStreamEvent(assistantMessageId, event.event)
      }

      this.updateMessageStatus(assistantMessageId, { type: 'complete' })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.updateMessageStatus(assistantMessageId, { type: 'cancelled' })
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        this.updateMessageStatus(assistantMessageId, {
          type: 'error',
          error: errorMessage
        })
      }
    } finally {
      this._isRunning = false
      this._abortController = null
      this._currentPart = null // Clean up
      this.notifySubscribers()
    }
  }

  private handleStreamEvent(messageId: string, event: StreamEvent): void {
    const messageIndex = this._messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    const message = this._messages[messageIndex]

    // Handle core events with type guards
    if (event.type === 'part-start') {
      this.handlePartStart(message, event as Extract<StreamEvent, { type: 'part-start' }>)
    } else if (event.type === 'text-delta' || event.type === 'assistant_thought') {
      this.handleTextDelta(message, event as Extract<StreamEvent, { type: 'text-delta' }>)
    } else if (event.type === 'part-finish') {
      this.handlePartFinish()
    } else if (event.type === 'metadata') {
      const metadataEvent = event as Extract<StreamEvent, { type: 'metadata' }>
      message.metadata = {
        ...message.metadata,
        conversationId: metadataEvent.conversationId,
        interactionId: metadataEvent.interactionId
      }
    } else if (event.type === 'capability_execution') {
      const capabilityEvent = event as Extract<StreamEvent, { type: 'capability_execution' }>
      message.content = [
        ...message.content,
        {
          type: 'capability',
          capabilityId: capabilityEvent.capabilityId,
          capabilityName: capabilityEvent.capabilityName,
          args: capabilityEvent.args
        } as CapabilityContent
      ]

      // Execute capability if manager is available
      if (this.config.capabilityExecutionManager) {
        this.config.capabilityExecutionManager.executeCapability(
          capabilityEvent.capabilityName,
          capabilityEvent.capabilityId,
          capabilityEvent.args,
          messageId,
          capabilityEvent.strategy
        )
      }
    } else if (event.type === 'error') {
      const errorEvent = event as Extract<StreamEvent, { type: 'error' }>
      message.content = [
        ...message.content,
        {
          type: 'error',
          data: errorEvent.error
        }
      ]
    } else {
      // Handle custom events
      const customEvent = event as Extract<StreamEvent, { data?: any }>
      message.content = [
        ...message.content,
        {
          type: customEvent.type,
          data: customEvent.data,
          parentId: customEvent.parentId
        }
      ]
    }

    // Update message with new reference
    const updatedMessages = [
      ...this._messages.slice(0, messageIndex),
      { ...message, timestamp: Date.now() },
      ...this._messages.slice(messageIndex + 1)
    ]

    this.updateMessages(updatedMessages)
  }

  private handlePartStart(message: Message, event: Extract<StreamEvent, { type: 'part-start' }>): void {
    const contentIndex = message.content.length

    // Create initial content based on type
    let initialContent: MessageContent

    switch (event.part.type) {
      case 'assistant_thought':
        // Initialize as array for assistant thoughts
        initialContent = {
          type: event.part.type,
          data: [],
          parentId: event.part.parentId
        } as any
        break

      case 'text':
        // Initialize as empty string for text
        initialContent = {
          type: event.part.type,
          data: '',
          parentId: event.part.parentId
        } as any
        break

      default:
        initialContent = {
          type: event.part.type,
          parentId: event.part.parentId
        } as any
    }

    // Add to message with new reference
    message.content = [...message.content, initialContent]

    // Track current part
    this._currentPart = {
      messageId: message.id,
      contentIndex,
      type: event.part.type,
      parentId: event.part.parentId
    }
  }

  private handleTextDelta(message: Message, event: Extract<StreamEvent, { type: 'text-delta' }>): void {
    if (!this._currentPart) {
      console.warn('Received text-delta without part-start')
      return
    }

    const content = message.content[this._currentPart.contentIndex] as any

    if (content.type === 'assistant_thought') {
      // For assistant thoughts, push each delta as a new array item
      if (!Array.isArray(content.data)) {
        content.data = []
      }
      if (event.delta.trim()) {
        content.data.push(event.delta.trim())
      }
    } else {
      // For text and other types, concatenate into a single string
      content.data = (content.data || '') + event.delta
    }
  }

  private handlePartFinish(): void {
    if (!this._currentPart) {
      console.warn('Received part-finish without part-start')
      return
    }

    // Part is complete, clear tracking
    this._currentPart = null
  }

  private updateMessageStatus(messageId: string, status: MessageStatus): void {
    const messageIndex = this._messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    const updatedMessages = [
      ...this._messages.slice(0, messageIndex),
      {
        ...this._messages[messageIndex],
        status
      },
      ...this._messages.slice(messageIndex + 1)
    ]

    this.updateMessages(updatedMessages)
  }

  public clear(): void {
    this.updateMessages([])
  }

  public cancelRun(): void {
    if (!this._isRunning || !this._abortController) {
      return
    }

    this._abortController.abort()
  }

  public reset(messages: Message[] = []): void {
    this.updateMessages([...messages])
  }
}
