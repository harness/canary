import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { ThreadListRuntime, ThreadListState } from '../../runtime/ThreadListRuntime/ThreadListRuntime'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useThreadList(): ThreadListRuntime {
  return useAssistantRuntime().threads
}

export function useThreadListState(): ThreadListState {
  const threadList = useThreadList()

  return useSyncExternalStore(
    callback => threadList.subscribe(callback),
    () => threadList.getState(),
    () => threadList.getState()
  )
}
