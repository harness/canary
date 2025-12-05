import { CapabilityContent } from '../../types/capability'
import { Message, MessageContent } from '../../types/message'
import { useAssistantRuntime } from '../hooks/useAssistantRuntime'
import { useCapabilityExecution } from '../hooks/useCapabilityExecution'

export interface CapabilityRendererProps {
  message: Message
  content: MessageContent
}

export function CapabilityRendererComp({ message, content }: CapabilityRendererProps) {
  const runtime = useAssistantRuntime()
  const capabilityContent = content as CapabilityContent
  const execution = useCapabilityExecution(capabilityContent.capabilityId)

  const renderer = runtime.capabilityRegistry.getRenderer(capabilityContent.capabilityName)

  if (!renderer || !execution) {
    return null
  }

  const Component = renderer.component

  return (
    <Component
      capabilityName={execution.name}
      capabilityId={execution.id}
      args={execution.args}
      result={execution.result}
      status={execution.status}
      message={message}
    />
  )
}
