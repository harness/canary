import { Message, MessageContent } from '@harnessio/ai-chat-core'
import { MarkdownViewer, Reasoning } from '@harnessio/ui/components'

interface ThoughtProcessContent {
  data: string[]
}

export const ThoughtProcessRenderer = ({
  message,
  content
}: {
  message: Message
  content: ThoughtProcessContent & MessageContent
}) => {
  const isStreaming = content.status?.type === 'streaming' || (!content.status && message.status.type === 'running')

  return (
    <Reasoning.Root className="mb-0 mt-cn-xs" isStreaming={isStreaming} defaultOpen={isStreaming}>
      <Reasoning.Trigger />
      <Reasoning.Content className="mt-cn-xs">
        {content.data.map((data: string, idx: number) => (
          <MarkdownViewer key={idx} muted markdownClassName="bg-transparent text-cn-3" variant="xs" source={data} />
        ))}
      </Reasoning.Content>
    </Reasoning.Root>
  )
}
