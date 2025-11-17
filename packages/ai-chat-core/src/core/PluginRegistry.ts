import { ChatPlugin, MessageRenderer } from '../types/plugin'

export class PluginRegistry {
  private plugins = new Map<string, ChatPlugin>()
  private renderersByType = new Map<string, MessageRenderer[]>()

  public registerPlugin(plugin: ChatPlugin): void {
    if (this.plugins.has(plugin.id)) {
      // handle duplicate plugin registration
      // show a warning / error
    }

    this.plugins.set(plugin.id, plugin)

    plugin.renderers.forEach(renderer => {
      const renderers = this.renderersByType.get(renderer.type) || []
      renderers.push(renderer)
      renderers.sort((a, b) => (b?.priority ?? 0) - (a?.priority ?? 0))
      this.renderersByType.set(renderer.type, renderers)
    })
  }

  public unregisterPlugin(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      return false
    }

    plugin.renderers.forEach(renderer => {
      const renderers = this.renderersByType.get(renderer.type) || []
      const filteredRenderers = renderers.filter(r => !plugin.renderers.includes(r))

      if (filteredRenderers.length === 0) {
        this.renderersByType.delete(renderer.type)
      } else {
        this.renderersByType.set(renderer.type, filteredRenderers)
      }
    })

    return this.plugins.delete(pluginId)
  }

  public getPlugin(pluginId: string): ChatPlugin | undefined {
    return this.plugins.get(pluginId)
  }

  public getAllPlugins(): ChatPlugin[] {
    return Array.from(this.plugins.values())
  }

  public getRenderersByType(type: string): MessageRenderer[] {
    return this.renderersByType.get(type) || []
  }

  public getBestRendererForType(type: string): MessageRenderer | undefined {
    const renderers = this.getRenderersByType(type)
    return renderers[0]
  }

  public clear(): void {
    this.plugins.clear()
    this.renderersByType.clear()
  }
}
