/**
 * Represents a single context item that will be displayed as a chip
 * and sent to the backend in the request metadata
 */
export interface ChatContextItem {
  /** Unique identifier for the context (e.g., 'currentPage', 'selectedConnector') */
  id: string

  /** Display name shown in the chip (e.g., 'Connectors', 'Pipeline: my-pipeline') */
  displayName: string

  /** Data sent to backend - will be spread into metadata */
  data: Record<string, unknown>

  /** Optional icon name for the chip */
  icon?: string

  /** Priority for ordering chips (lower number = higher priority) */
  priority?: number
}

/**
 * Map of context items by their ID
 */
export type ChatContextMap = Record<string, ChatContextItem>

/**
 * The aggregated context data that gets sent to the backend
 */
export type ChatContextData = Record<string, unknown>

/**
 * Context provider value
 */
export interface ChatContextValue {
  /** All registered context items */
  contexts: ChatContextMap

  /** Set or update a context item */
  setContext: (id: string, context: Omit<ChatContextItem, 'id'> | null) => void

  /** Remove a context item */
  removeContext: (id: string) => void

  /** Get the aggregated data for backend */
  getContextData: () => ChatContextData

  /** Clear all contexts */
  clearContexts: () => void
}
