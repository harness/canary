import { CapabilityExecution, CapabilityHandler } from '../types/capability'

export class CapabilityExecutionManager {
  private executions = new Map<string, CapabilityExecution>()
  private executionQueue: string[] = []
  private isProcessing = false
  private runningByName = new Map<string, string[]>()
  private subscribers = new Set<(executionId: string) => void>()
  private getHandler: (name: string) => CapabilityHandler | undefined

  constructor(getHandler: (name: string) => CapabilityHandler | undefined) {
    this.getHandler = getHandler
  }

  public async executeCapability<TArgs, TResult>(
    name: string,
    id: string,
    args: TArgs,
    messageId: string,
    strategy = 'queue'
  ): Promise<void> {
    const handler = this.getHandler(name)
    if (!handler) {
      console.warn(`No handler registered for capability: ${name}`)
      return
    }

    const execution: CapabilityExecution<TArgs, TResult> = {
      id,
      name,
      args,
      status: { type: 'queued' },
      timestamp: Date.now(),
      messageId
    }

    this.executions.set(id, execution)
    this.notifySubscribers(id)

    switch (strategy) {
      case 'queue':
      default:
        this.executionQueue.push(id)
        break
    }

    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.executionQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.executionQueue.length > 0) {
      const executionId = this.executionQueue.shift()!
      const execution = this.executions.get(executionId)

      if (!execution) continue

      const handler = this.getHandler(execution.name)
      if (!handler) continue

      execution.status = { type: 'running' }
      this.notifySubscribers(executionId)

      const running = this.runningByName.get(execution.name) || []
      running.push(executionId)
      this.runningByName.set(execution.name, running)

      try {
        const result = await handler.execute(execution.args, {
          messageId: execution.messageId,
          capabilityId: executionId
        })

        execution.status = { type: 'complete', result }
        execution.result = result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        execution.status = { type: 'error', error: errorMessage }
        execution.error = errorMessage
      } finally {
        const running = this.runningByName.get(execution.name) || []
        const index = running.indexOf(executionId)
        if (index > -1) {
          running.splice(index, 1)
        }
        if (running.length === 0) {
          this.runningByName.delete(execution.name)
        } else {
          this.runningByName.set(execution.name, running)
        }

        this.notifySubscribers(executionId)
      }
    }

    this.isProcessing = false
  }

  public getExecution(id: string): CapabilityExecution | undefined {
    return this.executions.get(id)
  }

  public getExecutionsByMessage(messageId: string): CapabilityExecution[] {
    return Array.from(this.executions.values()).filter(e => e.messageId === messageId)
  }

  public subscribe(callback: (executionId: string) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notifySubscribers(executionId: string): void {
    this.subscribers.forEach(callback => callback(executionId))
  }

  public clear(): void {
    this.executions.clear()
    this.executionQueue = []
    this.runningByName.clear()
  }
}
