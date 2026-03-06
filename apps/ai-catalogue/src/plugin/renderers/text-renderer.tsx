import { Message, MessageContent } from '@harnessio/ai-chat-core'

interface TextContent extends MessageContent<string> {
  type: 'text'
}

export const TextRenderer = ({ message, content }: { message: Message; content: TextContent }) => {
  const isUser = message.role === 'user'

  return (
    <div
      className={`rounded-lg px-4 py-3 max-w-[85%] ${
        isUser ? 'bg-cn-background-3 ml-auto' : 'bg-cn-background-2'
      }`}
    >
      <p className="text-cn-foreground-1 text-sm whitespace-pre-wrap">{content.data}</p>
    </div>
  )
}
