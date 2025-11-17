import { PluginRegistry } from '../../core/PluginRegistry'
import { Message } from '../../types/message'
import { ChatPlugin } from '../../types/plugin'
import { BaseSubscribable } from '../../utils/Subscribable'
import { ContentFocusRuntime } from '../ContentFocusRuntime/ContentFocusRuntime'
import { ThreadListRuntime, ThreadListRuntimeConfig } from '../ThreadListRuntime/ThreadListRuntime'
import { ThreadRuntime } from '../ThreadRuntime/ThreadRuntime'

export interface AssistantRuntimeConfig extends ThreadListRuntimeConfig {
  plugins?: ChatPlugin[]
}

export class AssistantRuntime extends BaseSubscribable {
  public readonly threads: ThreadListRuntime
  public readonly pluginRegistry: PluginRegistry
  private _contentFocusRuntime: ContentFocusRuntime
  private _currentThreadUnsubscribe?: () => void

  constructor(config: AssistantRuntimeConfig) {
    super()

    // Initialize plugin registry
    this.pluginRegistry = new PluginRegistry()
    if (config.plugins) {
      config.plugins.forEach(plugin => {
        this.pluginRegistry.registerPlugin(plugin)
      })
    }

    // Initialize thread list
    this.threads = new ThreadListRuntime({
      streamAdapter: config.streamAdapter,
      threadListAdapter: config.threadListAdapter
    })

    this._contentFocusRuntime = new ContentFocusRuntime()

    // Subscribe to content focus changes
    this._contentFocusRuntime.subscribe(() => {
      this.notifySubscribers()
    })

    // Subscribe to thread list changes (including thread switches)
    this.threads.subscribe(() => {
      // Re-subscribe to the new main thread when it changes
      this.subscribeToCurrentThread()
      this.notifySubscribers()
    })

    // Initial subscription to main thread
    this.subscribeToCurrentThread()
  }

  public get thread(): ThreadRuntime {
    return this.threads.getMainThread()
  }

  public get contentFocus(): ContentFocusRuntime {
    return this._contentFocusRuntime
  }

  /**
   * Register a plugin
   */
  public registerPlugin(plugin: ChatPlugin): void {
    this.pluginRegistry.registerPlugin(plugin)

    plugin.init?.({
      streamingEnabled: true,
      feedbackEnabled: false,
      detailPanelEnabled: true
    })
  }

  /**
   * Unregister a plugin
   */
  public unregisterPlugin(pluginId: string): boolean {
    return this.pluginRegistry.unregisterPlugin(pluginId)
  }

  /**
   * Subscribe to the current main thread
   * Called when thread switches to ensure we listen to the right thread
   */
  private subscribeToCurrentThread(): void {
    // Unsubscribe from previous thread
    if (this._currentThreadUnsubscribe) {
      this._currentThreadUnsubscribe()
    }

    // Subscribe to new main thread
    this._currentThreadUnsubscribe = this.thread.subscribe(() => {
      this.handleMessagesChange(this.thread.messages)
      this.notifySubscribers()
    })
  }

  private handleMessagesChange(messages: readonly Message[]): void {
    if (messages.length === 0) return

    // Only auto-focus when a new assistant message completes
    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role === 'assistant' && lastMessage.status.type === 'complete') {
      this.autoFocusLastContent(messages)
    }
  }

  private autoFocusLastContent(messages: readonly Message[]): void {
    if (messages.length === 0) return
    if (this._contentFocusRuntime.isActive) return // Don't override existing focus

    // Find last assistant message
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]
      if (message.role !== 'assistant') continue

      // Find last content with focus capability
      for (let j = message.content.length - 1; j >= 0; j--) {
        const content = message.content[j]
        const renderer = this.pluginRegistry.getRenderersByType(content.type)

        if (renderer.length > 0 && renderer[0].capabilities?.supportsFocus) {
          this._contentFocusRuntime.focus(content, message, j, 'detail')
          return
        }
      }
    }
  }
}
