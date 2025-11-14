import { useSyncExternalStore } from 'use-sync-external-store/shim'

import { Message } from '../../types/message'
import { useCurrentThread } from './useCurrentThread'

export function useMessages(): readonly Message[] {
  const thread = useCurrentThread()

  return useSyncExternalStore(
    callback => {
      return thread.subscribe(() => {
        callback()
      })
    },

    () => {
      return thread.messages
    },
    () => thread.messages
  )
}
