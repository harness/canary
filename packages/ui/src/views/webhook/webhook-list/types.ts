export interface WebhookType {
  id: number
  name: string
  enabled: boolean
  createdAt: string
  description: string
}

interface WebhookStore {
  webhooks: WebhookType[] | null
  // onDelete: (id: number) => void
  totalPages: number
  page: number
  setPage: (page: number) => void
}

export interface WebhookListProps {
  useWebhookStore: () => WebhookStore
}
