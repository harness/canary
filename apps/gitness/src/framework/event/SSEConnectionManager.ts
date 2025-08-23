import { EventSourcePolyfill } from 'event-source-polyfill'

import { SSEEvent } from '../../types'
import { eventManager } from './EventManager'

/**
 * Singleton class to manage a single persistent SSE connection
 * This ensures the connection persists even when components are unmounted
 */
class SSEConnectionManager {
  private static instance: SSEConnectionManager
  private eventSource: EventSource | null = null
  private isConnecting = false
  private space: string | null = null

  private constructor() {}

  public static getInstance(): SSEConnectionManager {
    if (!SSEConnectionManager.instance) {
      SSEConnectionManager.instance = new SSEConnectionManager()
    }
    return SSEConnectionManager.instance
  }

  public connect(space: string, apiPath: (path: string) => string): void {
    if (this.eventSource && this.space === space) {
      return
    }

    if (this.eventSource && this.space !== space) {
      this.disconnect()
    }

    if (this.isConnecting) {
      return
    }

    this.isConnecting = true
    this.space = space

    const pathAndQuery = apiPath(`/api/v1/spaces/${space}/+/events`)
    const options: { heartbeatTimeout: number; headers?: { Authorization?: string } } = {
      heartbeatTimeout: 999999999
    }

    this.eventSource = new EventSourcePolyfill(pathAndQuery, options)

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        eventManager.publish(event.type, data)
      } catch (error) {
        console.error('Error parsing event data:', error)
      }
    }

    const handleError = (event: Event) => {
      eventManager.publish('error', event)
      this.disconnect()
    }

    this.eventSource.addEventListener('error', handleError)

    const allEventTypes = Object.values(SSEEvent)

    for (const eventType of allEventTypes) {
      this.eventSource.addEventListener(eventType, handleMessage)
    }

    this.isConnecting = false
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.space = null
    }
  }

  public isConnected(): boolean {
    return this.eventSource !== null
  }
}

export const sseConnectionManager = SSEConnectionManager.getInstance()
