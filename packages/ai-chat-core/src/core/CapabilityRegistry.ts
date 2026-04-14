import { CapabilityHandler, CapabilityRenderer } from '../types/capability'

interface HandlerEntry {
  handler: CapabilityHandler
  priority: number
}

interface RendererEntry {
  renderer: CapabilityRenderer
  priority: number
}

export class CapabilityRegistry {
  private handlers = new Map<string, HandlerEntry[]>()
  private renderers = new Map<string, RendererEntry[]>()

  public registerHandler(name: string, handler: CapabilityHandler, priority = 0): void {
    const entries = this.handlers.get(name) || []
    const entry: HandlerEntry = { handler, priority }

    // Insert in sorted order (highest priority first)
    const insertIndex = entries.findIndex(e => e.priority < priority)
    if (insertIndex === -1) {
      entries.push(entry)
    } else {
      entries.splice(insertIndex, 0, entry)
    }

    this.handlers.set(name, entries)
  }

  public registerRenderer(name: string, renderer: CapabilityRenderer, priority = 0): void {
    const entries = this.renderers.get(name) || []
    const entry: RendererEntry = { renderer, priority }

    // Insert in sorted order (highest priority first)
    const insertIndex = entries.findIndex(e => e.priority < priority)
    if (insertIndex === -1) {
      entries.push(entry)
    } else {
      entries.splice(insertIndex, 0, entry)
    }

    this.renderers.set(name, entries)
  }

  public unregister(name: string): void {
    this.handlers.delete(name)
    this.renderers.delete(name)
  }

  public getHandler(name: string): CapabilityHandler | undefined {
    const entries = this.handlers.get(name)
    return entries?.[0]?.handler
  }

  public getRenderer(name: string): CapabilityRenderer | undefined {
    const entries = this.renderers.get(name)
    return entries?.[0]?.renderer
  }

  public getStrategy() {
    return 'queue'
  }

  public hasHandler(name: string): boolean {
    const entries = this.handlers.get(name)
    return entries !== undefined && entries.length > 0
  }

  public hasRenderer(name: string): boolean {
    const entries = this.renderers.get(name)
    return entries !== undefined && entries.length > 0
  }

  public clear(): void {
    this.handlers.clear()
    this.renderers.clear()
  }

  public getAllCapabilityNames(): string[] {
    return Array.from(new Set([...this.handlers.keys(), ...this.renderers.keys()]))
  }
}
