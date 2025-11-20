import { AssistantRuntime } from '../../runtime/AssistantRuntime/AssistantRuntime'
import { useAssistantRuntimeContext } from '../providers/AssistantRuntimeProvider'

export function useAssistantRuntime(): AssistantRuntime {
  return useAssistantRuntimeContext()
}
