import { Message, MessageContent } from './message'

export interface MessageRendererProps<T extends MessageContent = MessageContent> {
  content: T
  message: Message
  onClick?: () => void
}

export interface MessageRenderer<T extends MessageContent = any> {
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
  canHandle?: (message: Message, content: MessageContent) => boolean
}

export interface GroupRendererProps {
  groupKey: string
  items: MessageContent[]
  message: Message
}

export interface GroupRenderer {
  groupType: string
  component: React.ComponentType<GroupRendererProps>
  priority?: number
  canHandle?: (groupKey: string, items: MessageContent[]) => boolean
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
  groupRenderers?: GroupRenderer[]
  init?: (config: ChatPluginConfig) => void
}

export interface PluginConfig {
  plugins?: ChatPlugin[]
}
