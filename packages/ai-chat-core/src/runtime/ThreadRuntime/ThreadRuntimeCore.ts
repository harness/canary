import { StreamAdapter } from '../../types/adapters'
import { AppendMessage, Message, MessageContent, MessageStatus, MetadataContent } from '../../types/message'
import { RuntimeCapabilities } from '../../types/thread'
import { generateMessageId } from '../../utils/idGenerator'
import { BaseSubscribable } from '../../utils/Subscribable'

export interface ThreadRuntimeCoreConfig {
  streamAdapter: StreamAdapter
  initialMessages?: Message[]
  onMessagesChange?: (messages: Message[]) => void
}

export class ThreadRuntimeCore extends BaseSubscribable {
  private _messages: Message[] = []
  private _isRunning = false
  private _isDisabled = false
  private _abortController: AbortController | null = null

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

    this._messages.push(newMessage)
    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()
  }

  public async startRun(userMessage: AppendMessage): Promise<void> {
    if (this._isRunning) {
      throw new Error('A run is already in progress')
    }

    this.append(userMessage)
    this._isRunning = true
    this._abortController = new AbortController()
    this.notifySubscribers()

    const assistantMessageId = generateMessageId()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: [],
      status: { type: 'running' },
      timestamp: Date.now()
    }

    this._messages.push(assistantMessage)
    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()

    try {
      const stream = this.config.streamAdapter.stream({
        messages: this._messages,
        signal: this._abortController.signal
      })

      for await (const chunk of stream) {
        if (this._abortController.signal.aborted) {
          break
        }

        this.handleChunk(assistantMessageId, chunk)
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
      this.notifySubscribers()
    }
  }

  private handleChunk(messageId: string, chunk: MessageContent): void {
    const messageIndex = this._messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    const message = this._messages[messageIndex]

    if (chunk.type === 'metadata') {
      // Type narrowed to MetadataChunk
      const metadataChunk = chunk as MetadataContent
      message.metadata = {
        ...message.metadata,
        conversationId: metadataChunk.conversationId,
        interactionId: metadataChunk.interactionId
      }
    } else {
      message.content.push(chunk)
    }

    // Create new array reference for React to detect change
    this._messages = [
      ...this._messages.slice(0, messageIndex),
      { ...message, timestamp: Date.now() },
      ...this._messages.slice(messageIndex + 1)
    ]
    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()
  }

  private updateMessageStatus(messageId: string, status: MessageStatus): void {
    const messageIndex = this._messages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) return

    this._messages[messageIndex] = {
      ...this._messages[messageIndex],
      status
    }

    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()
  }

  public clear(): void {
    this._messages = []
    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()
  }

  public cancelRun(): void {
    if (!this._isRunning || !this._abortController) {
      return
    }

    this._abortController.abort()
  }

  public reset(messages: Message[] = []): void {
    this._messages = [...messages]
    this.config.onMessagesChange?.(this._messages)
    this.notifySubscribers()
  }
}
