import { PluginRegistry } from '../../core/PluginRegistry'
import { ChatPlugin } from '../../types/plugin'
import { BaseSubscribable } from '../../utils/Subscribable'
import { ThreadListRuntime, ThreadListRuntimeConfig } from '../ThreadListRuntime/ThreadListRuntime'
import { ThreadRuntime } from '../ThreadRuntime/ThreadRuntime'

export interface AssistantRuntimeConfig extends ThreadListRuntimeConfig {
  plugins?: ChatPlugin[]
}

export class AssistantRuntime extends BaseSubscribable {
  public readonly threads: ThreadListRuntime
  public readonly pluginRegistry: PluginRegistry

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
  }

  public get thread(): ThreadRuntime {
    return this.threads.main
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
}
