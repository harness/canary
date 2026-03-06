import { CatalogueEntry, ChatPlugin, MessageRendererProps } from '../types/plugin'

export function extractCatalogueEntries(
  plugin: ChatPlugin
): Array<CatalogueEntry & { type: string; component: React.ComponentType<MessageRendererProps> }> {
  return plugin.renderers
    .filter(r => r.catalogue)
    .map(r => ({ ...r.catalogue!, type: r.type, component: r.component }))
}

export function extractAllCatalogueEntries(
  plugins: ChatPlugin[]
): Array<CatalogueEntry & { type: string; component: React.ComponentType<MessageRendererProps>; pluginId: string }> {
  return plugins.flatMap(plugin =>
    plugin.renderers
      .filter(r => r.catalogue)
      .map(r => ({ ...r.catalogue!, type: r.type, component: r.component, pluginId: plugin.id }))
  )
}
