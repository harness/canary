import { Message, MessageContent } from '../../types/message'
import { BaseSubscribable } from '../../utils/Subscribable'

export type FocusContext = 'detail'

export interface ContentFocusState {
  isActive: boolean
  context: FocusContext | null
  focusedContent: MessageContent | null
  focusedMessage: Message | null
  focusedMessageId: string | null
  focusedContentIndex: number | null
}

export class ContentFocusRuntime extends BaseSubscribable {
  private _state: ContentFocusState = {
    isActive: false,
    context: null,
    focusedContent: null,
    focusedMessage: null,
    focusedMessageId: null,
    focusedContentIndex: null
  }

  public get state(): ContentFocusState {
    return this._state
  }

  public get isActive(): boolean {
    return this._state.isActive
  }

  public get context(): FocusContext | null {
    return this._state.context
  }

  public get focusedContent(): MessageContent | null {
    return this._state.focusedContent
  }

  public get focusedMessage(): Message | null {
    return this._state.focusedMessage
  }

  public get focusedMessageId(): string | null {
    return this._state.focusedMessageId
  }

  public get focusedContentIndex(): number | null {
    return this._state.focusedContentIndex
  }

  public focus(
    content: MessageContent,
    message: Message,
    contentIndex: number,
    context: FocusContext = 'detail'
  ): void {
    this._state = {
      isActive: true,
      context,
      focusedContent: content,
      focusedMessage: message,
      focusedMessageId: message.id,
      focusedContentIndex: contentIndex
    }
    this.notifySubscribers()
  }

  public blur(): void {
    this._state = {
      isActive: false,
      context: null,
      focusedContent: null,
      focusedMessage: null,
      focusedMessageId: null,
      focusedContentIndex: null
    }
    this.notifySubscribers()
  }

  public toggle(
    content: MessageContent,
    message: Message,
    contentIndex: number,
    context: FocusContext = 'detail'
  ): void {
    if (
      this._state.isActive &&
      this._state.focusedMessageId === message.id &&
      this._state.focusedContentIndex === contentIndex &&
      this._state.context === context
    ) {
      this.blur()
    } else {
      this.focus(content, message, contentIndex, context)
    }
  }

  public switchContext(context: FocusContext): void {
    if (this._state.isActive && this._state.focusedContent) {
      this._state = {
        ...this._state,
        context
      }
      this.notifySubscribers()
    }
  }

  public focusNext(messages: readonly Message[]): void {
    if (!this._state.focusedMessageId || !messages.length) return

    const currentMsgIndex = messages.findIndex(m => m.id === this._state.focusedMessageId)
    if (currentMsgIndex === -1) return

    const currentMsg = messages[currentMsgIndex]
    const currentContentIndex = this._state.focusedContentIndex ?? 0

    if (currentContentIndex + 1 < currentMsg.content.length) {
      const nextContent = currentMsg.content[currentContentIndex + 1]
      this.focus(nextContent, currentMsg, currentContentIndex + 1, this._state.context || 'detail')
      return
    }

    // Try first content in next message
    if (currentMsgIndex + 1 < messages.length) {
      const nextMsg = messages[currentMsgIndex + 1]
      if (nextMsg.content.length > 0) {
        this.focus(nextMsg.content[0], nextMsg, 0, this._state.context || 'detail')
      }
    }
  }

  public focusPrevious(messages: readonly Message[]): void {
    if (!this._state.focusedMessageId || !messages.length) return

    const currentMsgIndex = messages.findIndex(m => m.id === this._state.focusedMessageId)
    if (currentMsgIndex === -1) return

    const currentMsg = messages[currentMsgIndex]
    const currentContentIndex = this._state.focusedContentIndex ?? 0

    if (currentContentIndex > 0) {
      const prevContent = currentMsg.content[currentContentIndex - 1]
      this.focus(prevContent, currentMsg, currentContentIndex - 1, this._state.context || 'detail')
      return
    }

    // Try last content in previous message
    if (currentMsgIndex > 0) {
      const prevMsg = messages[currentMsgIndex - 1]
      if (prevMsg.content.length > 0) {
        const lastIndex = prevMsg.content.length - 1
        this.focus(prevMsg.content[lastIndex], prevMsg, lastIndex, this._state.context || 'detail')
      }
    }
  }
}
