import { Message } from '@harnessio/ai-chat-core'
import { CopyButton, MessageBubble, Text, TimeAgoContent, Tooltip, useFormattedTime } from '@harnessio/ui/components'
import { formatTime } from '@harnessio/ui/utils'

interface TextContent {
  data: string
}

const TextRenderer = ({ message, content }: { message: Message; content: TextContent }) => {
  const { formattedFull } = useFormattedTime(message.timestamp)

  return (
    <MessageBubble.Root role={message.role} className="max-w-full">
      <MessageBubble.Content className="max-w-full">
        {message.role === 'user' ? (
          <MessageBubble.Text>{content.data}</MessageBubble.Text>
        ) : (
          <MessageBubble.Markdown speed={message.metadata?.demo ? 10 : undefined}>
            {content.data}
          </MessageBubble.Markdown>
        )}
      </MessageBubble.Content>
      {message.role === 'user' && (
        <MessageBubble.Footer>
          <CopyButton buttonVariant={'transparent'} size="sm" name={content.data} />

          <Tooltip content={<TimeAgoContent formattedFullArray={formattedFull} />}>
            <Text as="time" variant="caption-normal" color="foreground-4" className="cursor-pointer">
              {formatTime(new Date(message.timestamp))}
            </Text>
          </Tooltip>
        </MessageBubble.Footer>
      )}
    </MessageBubble.Root>
  )
}

export default TextRenderer
