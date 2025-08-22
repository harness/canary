type Callback = (data: any) => void

class EventManager {
  private listeners: Record<string, Callback[]> = {}

  /**
   * Check if a callback is already subscribed to an event type
   */
  isSubscribed(eventType: string, callback: Callback): boolean {
    if (!this.listeners[eventType]) {
      return false
    }
    return this.listeners[eventType].includes(callback)
  }

  /**
   * Subscribe a callback to an event type if not already subscribed
   */
  subscribe(eventType: string, callback: Callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = []
    }

    // Only add the callback if it's not already subscribed
    if (!this.isSubscribed(eventType, callback)) {
      this.listeners[eventType].push(callback)
    }

    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback)
    }
  }

  publish(eventType: string, data: any) {
    if (this.listeners[eventType]) {
      for (const callback of this.listeners[eventType]) {
        callback(data)
      }
    }
  }

  clear(eventType?: string) {
    if (eventType) {
      delete this.listeners[eventType]
    } else {
      this.listeners = {}
    }
  }
}

export const eventManager = new EventManager()
