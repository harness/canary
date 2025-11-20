import { FocusContext } from '../runtime/ContentFocusRuntime/ContentFocusRuntime'
import { Message, MessageContent } from './message'

export interface MessageRendererProps<T extends MessageContent = MessageContent> {
  content: T
  message: Message
  onClick?: () => void
}

export interface MessageRenderer<T extends MessageContent = any> {
  type: string
  component: React.ComponentType<MessageRendererProps<T>>
  auxiliary?: {
    detail?: React.ComponentType<AuxiliaryRendererProps>
  }

  priority?: number

  capabilities?: {
    supportsFocus?: boolean
    supportsPreview?: boolean
    supportsFullscreen?: boolean
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

export interface AuxiliaryRendererProps extends MessageRendererProps {
  context: FocusContext
  onClose?: () => void
  onNavigate?: (direction: 'next' | 'prev') => void
  onSwitchContext?: (context: FocusContext) => void
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
