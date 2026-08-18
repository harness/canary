import { SystemEvent } from '../../types/adapters'
import { AppendMessage, Message, MessageContent, TextContent } from '../../types/message'
import { RuntimeCapabilities, ThreadState } from '../../types/thread'
import { BaseSubscribable, Unsubscribe } from '../../utils/Subscribable'
import ComposerRuntime from '../ComposerRuntime/ComposerRuntime'
import { ThreadRuntimeCore } from './ThreadRuntimeCore'

const ELICITATION_TYPE_PREFIX = 'elicitation_'

/** Minimal shape of an elicitation content item's `data` used for supersession. */
interface ElicitationLike {
  review_id?: string
  status?: string
  resolved?: unknown
}

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

  public get isWaitingForUser(): boolean {
    return this._core.isWaitingForUser
  }

  public get pendingCapability(): { capabilityId: string; capabilityName: string } | null {
    return this._core.pendingCapability
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
      isWaitingForUser: this._core.isWaitingForUser,
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
      // If waiting for user action, auto-cancel the pending capability first
      if (this._core.isWaitingForUser && this._core.pendingCapability) {
        await this._core.startSystemEventRun({
          event_type: 'action_cancelled',
          capability_id: this._core.pendingCapability.capabilityName,
          result: { success: false }
        })
      }

      // Close still-open elicitation cards in the live UI. ml-infra already
      // pops pending reviews on this plain-text turn, so we do not fire a
      // separate action_cancelled stream.
      if (this._core.supersedeOpenElicitationsOnSend) {
        this.supersedeOpenElicitations()
      }

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

  /**
   * Marks every still-open elicitation card terminal in the live thread.
   * Resume invalidation happens on the following plain-text turn in ml-infra.
   */
  private supersedeOpenElicitations(): void {
    for (const message of this._core.messages) {
      const hasOpen = message.content.some(item => this.isOpenElicitation(item))
      if (!hasOpen) continue
      this._core.updateMessageContent(message.id, content =>
        content.map(item =>
          this.isOpenElicitation(item)
            ? { ...item, data: { ...(item.data as object), status: 'superseded' } }
            : item
        )
      )
    }
  }

  private isOpenElicitation(item: MessageContent): boolean {
    if (!item.type.startsWith(ELICITATION_TYPE_PREFIX)) return false
    const data = item.data as ElicitationLike | undefined
    if (!data?.review_id || data.resolved) return false
    return !data.status || data.status === 'open'
  }

  /**
   * Dispatches a system event (e.g. a user click on an elicitation card).
   *
   * Prior to this change, this method wrapped startSystemEventRun in a
   * try/catch that silently swallowed the "A run is already in progress"
   * error thrown by the core when _isRunning was still true — causing
   * clicks fired during the tail of the previous run to disappear.
   *
   * Now we await waitForIdle() before dispatching so the event is
   * reliably delivered as soon as the in-flight run completes. Callers
   * do not need their own queueing primitive.
   */
  public async sendSystemEvent(systemEvent: SystemEvent): Promise<void> {
    await this._core.waitForIdle()
    await this._core.startSystemEventRun(systemEvent)
  }

  /**
   * Registers a generic background task that keeps the thread reported as
   * running for as long as it is active, even when no stream run is in
   * flight. Use this for UI-driven async work (e.g. a card polling a status
   * API) so the composer shows a running/stop affordance. The work is
   * cancelled when the user presses stop (cancelRun), which invokes the
   * provided onCancel callback. Returns an opaque id for stopBackgroundTask.
   */
  public startBackgroundTask(options?: { onCancel?: () => void }): string {
    return this._core.startBackgroundTask(options)
  }

  /**
   * Removes a previously registered background task by its id.
   */
  public stopBackgroundTask(id: string): void {
    this._core.stopBackgroundTask(id)
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

  public updateMessageContent(messageId: string, updater: (content: MessageContent[]) => MessageContent[]): void {
    this._core.updateMessageContent(messageId, updater)
  }

  public subscribe(callback: () => void): Unsubscribe {
    return super.subscribe(callback)
  }
}
