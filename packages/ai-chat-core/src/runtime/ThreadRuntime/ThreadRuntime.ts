import { AppendMessage, Message, TextContent } from '../../types/message'
import { RuntimeCapabilities, ThreadState } from '../../types/thread'
import { BaseSubscribable, Unsubscribe } from '../../utils/Subscribable'
import ComposerRuntime from '../ComposerRuntime/ComposerRuntime'
import { ThreadRuntimeCore } from './ThreadRuntimeCore'

export class ThreadRuntime extends BaseSubscribable {
  public readonly composer: ComposerRuntime

  constructor(private _core: ThreadRuntimeCore) {
    super()
    this.composer = new ComposerRuntime()

    // Subscribe to core changes and propagate
    this._core.subscribe(() => {
      this.notifySubscribers()
    })
  }

  public get messages(): readonly Message[] {
    return this._core.messages
  }

  public get isRunning(): boolean {
    return this._core.isRunning
  }

  public get isDisabled(): boolean {
    return this._core.isDisabled
  }

  public get capabilities(): RuntimeCapabilities {
    return this._core.capabilities
  }

  public get conversationId(): string | undefined {
    return this._core.conversationId
  }

  public get title(): string | undefined {
    return this._core.title
  }

  public getState(): ThreadState {
    return {
      threadId: 'main', // Will be set by ThreadListRuntime
      isDisabled: this._core.isDisabled,
      isRunning: this._core.isRunning,
      capabilities: this._core.capabilities,
      conversationId: this._core.conversationId,
      title: this._core.title
    }
  }

  public append(message: AppendMessage): void {
    this._core.append(message)
  }

  public async send(text: string): Promise<void> {
    if (!text.trim()) return

    this.composer.setSubmitting(true)

    try {
      this.composer.clear()
      await this._core.startRun({
        role: 'user',
        content: [{ type: 'text', data: text } as TextContent]
      })
    } catch (e) {
      // TODO: Handle error
    } finally {
      this.composer.setSubmitting(false)
    }
  }

  public cancelRun(): void {
    this._core.cancelRun()
  }

  public clear(): void {
    this._core.clear()
  }

  public reset(messages: Message[] = []): void {
    this._core.reset(messages)
  }

  public setConversationId(conversationId: string | undefined): void {
    this._core.setConversationId(conversationId)
  }

  public setTitle(title: string | undefined): void {
    this._core.setTitle(title)
  }

  public subscribe(callback: () => void): Unsubscribe {
    return super.subscribe(callback)
  }
}
