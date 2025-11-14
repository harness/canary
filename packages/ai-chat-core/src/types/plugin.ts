import { Message, MessageContent } from './message'

export interface MessageRendererProps<T extends MessageContent = MessageContent> {
  content: T
  message: Message
  onClick?: () => void
}

export interface MessageRenderer<T extends MessageContent = MessageContent> {
  type: string
  component: React.ComponentType<MessageRendererProps<T>>
  detailComponent?: React.ComponentType<{ content: T }>
  priority: number
  showInDetailPanel?: boolean
  reuseInstance?: boolean
  hideRootLoading?: boolean
  layoutRequirements?: {
    requiresDetailPanel?: boolean
    fallbackBehavior?: 'inline' | 'hide'
  }
}

export interface ChatPluginConfig {
  endpoint?: string
  context?: Record<string, unknown>
  streamingEnabled?: boolean
  feedbackEnabled?: boolean
  detailPanelEnabled?: boolean
}

export interface ChatPlugin {
  id: string
  name: string
  renderers: MessageRenderer[]
  init?: (config: ChatPluginConfig) => void
}

export interface PluginConfig {
  plugins?: ChatPlugin[]
}
