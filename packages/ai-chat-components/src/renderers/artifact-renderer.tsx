import { ArtifactContent, generateMessageId, Message, useAssistantRuntime } from '@harnessio/ai-chat-core'
import { Card, IconV2, Layout, Text } from '@harnessio/ui/components'

interface ArtifactRendererProps {
  message: Message
  content: ArtifactContent
}

export function ArtifactRenderer({ content, message }: ArtifactRendererProps) {
  const runtime = useAssistantRuntime()
  const artifactData = content.data

  const handleReExecute = () => {
    const newCapabilityId = generateMessageId()

    runtime.capabilityExecutionManager?.executeCapability(
      artifactData.capabilityName,
      newCapabilityId,
      artifactData.originalArgs,
      message.id,
      'queue'
    )
  }

  return (
    <Card.Root size="sm" onClick={handleReExecute} className="cursor-pointer">
      <Card.Content>
        <Layout.Horizontal align="center" gap="sm">
          <IconV2 name="docs" size="xs" color={'neutral'} />
          <Text variant="body-normal" color="foreground-1" lineClamp={1}>
            {artifactData.displayData.name}
          </Text>
        </Layout.Horizontal>
      </Card.Content>
    </Card.Root>
  )
}
