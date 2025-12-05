import { CapabilityExecutionStrategy, CapabilityHandler, CapabilityRenderer } from '../types/capability'

export class CapabilityRegistry {
  private handlers = new Map<string, CapabilityHandler>()
  private renderers = new Map<string, CapabilityRenderer>()
  private strategies = new Map<string, CapabilityExecutionStrategy>()

  public registerHandler(name: string, handler: CapabilityHandler, strategy?: CapabilityExecutionStrategy): void {
    this.handlers.set(name, handler)
    if (strategy) {
      this.strategies.set(name, strategy)
    }
  }

  public registerRenderer(name: string, renderer: CapabilityRenderer): void {
    this.renderers.set(name, renderer)
  }

  public unregister(name: string): void {
    this.handlers.delete(name)
    this.renderers.delete(name)
    this.strategies.delete(name)
  }

  public getHandler(name: string): CapabilityHandler | undefined {
    return this.handlers.get(name)
  }

  public getRenderer(name: string): CapabilityRenderer | undefined {
    return this.renderers.get(name)
  }

  public getStrategy(name: string): CapabilityExecutionStrategy {
    return this.strategies.get(name) || 'queue'
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
    this.strategies.clear()
  }

  public getAllCapabilityNames(): string[] {
    return Array.from(new Set([...this.handlers.keys(), ...this.renderers.keys()]))
  }
}
