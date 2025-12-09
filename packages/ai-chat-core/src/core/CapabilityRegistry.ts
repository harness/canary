import { CapabilityHandler, CapabilityRenderer } from '../types/capability'

export class CapabilityRegistry {
  private handlers = new Map<string, CapabilityHandler>()
  private renderers = new Map<string, CapabilityRenderer>()

  public registerHandler(name: string, handler: CapabilityHandler): void {
    this.handlers.set(name, handler)
  }

  public registerRenderer(name: string, renderer: CapabilityRenderer): void {
    this.renderers.set(name, renderer)
  }

  public unregister(name: string): void {
    this.handlers.delete(name)
    this.renderers.delete(name)
  }

  public getHandler(name: string): CapabilityHandler | undefined {
    return this.handlers.get(name)
  }

  public getRenderer(name: string): CapabilityRenderer | undefined {
    return this.renderers.get(name)
  }

  public getStrategy() {
    return 'queue'
  }

  public hasHandler(name: string): boolean {
    return this.handlers.has(name)
  }

  public hasRenderer(name: string): boolean {
    return this.renderers.has(name)
  }

  public clear(): void {
    this.handlers.clear()
    this.renderers.clear()
  }

  public getAllCapabilityNames(): string[] {
    return Array.from(new Set([...this.handlers.keys(), ...this.renderers.keys()]))
  }
}
