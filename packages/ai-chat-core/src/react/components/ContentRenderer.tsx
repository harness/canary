import { Message, MessageContent } from '../../types/message'
import { useContentRenderer } from '../hooks/useContentRenderer'
import { CapabilityRendererComp } from './CapabilityRenderer'

export function ContentRenderer({ message, content }: { message: Message; content: MessageContent }) {
  const { component } = useContentRenderer(content.type)

  if (content.type === 'capability') {
    return <CapabilityRendererComp message={message} content={content} />
  }

  if (!component) {
    return null
  }

  const Component = component
  return <Component content={content} message={message} />
}
