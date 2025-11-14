let messageIdCounter = 0
let threadIdCounter = 0

export function generateMessageId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`
}

export function generateThreadId(): string {
  return `thread-${Date.now()}-${++threadIdCounter}`
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
