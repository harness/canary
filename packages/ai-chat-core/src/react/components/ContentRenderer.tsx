import { Message, MessageContent } from '../../types/message'
import { useContentRenderer } from '../hooks/useContentRenderer'

export function ContentRenderer({ message, content }: { message: Message; content: MessageContent }) {
  const { component } = useContentRenderer(content.type)

  if (!component) {
    return null
  }

  const Component = component
  return <Component content={content} message={message} />
}
