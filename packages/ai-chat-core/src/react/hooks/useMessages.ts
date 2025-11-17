import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { Message } from '../../types/message'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useMessages(): readonly Message[] {
  const runtime = useAssistantRuntime()

  return useSyncExternalStore(
    callback => {
      // Subscribe to runtime, which notifies when thread switches
      // or when the current thread's messages change
      return runtime.subscribe(() => {
        callback()
      })
    },

    () => {
      // Always get messages from the current main thread
      return runtime.thread.messages
    },
    () => runtime.thread.messages
  )
}
