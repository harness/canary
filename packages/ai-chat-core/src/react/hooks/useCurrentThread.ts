import { ThreadRuntime } from '../../runtime/ThreadRuntime/ThreadRuntime'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useCurrentThread(): ThreadRuntime {
  const mainThread = useAssistantRuntime().threads.getMainThread()
  return mainThread
}
