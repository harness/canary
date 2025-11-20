import { useEffect, useState } from 'react'

import { ThreadListState } from '../../runtime/ThreadListRuntime/ThreadListRuntime'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useThreadList() {
  const runtime = useAssistantRuntime()

  return {
    switchToThread: (threadId: string) => runtime.threads.switchToThread(threadId),
    switchToNewThread: () => runtime.threads.switchToNewThread(),
    loadThreads: () => runtime.threads.loadThreads?.(),
    renameThread: (threadId: string, title: string) => runtime.threads['renameThread']?.(threadId, title),
    deleteThread: (threadId: string) => runtime.threads['deleteThread']?.(threadId)
  }
}

export function useThreadListState() {
  const runtime = useAssistantRuntime()
  const [state, setState] = useState<ThreadListState>(runtime.threads.getState())

  useEffect(() => {
    const unsubscribe = runtime.threads.subscribe(() => {
      setState(runtime.threads.getState())
    })
    return unsubscribe
  }, [runtime])

  return state
}
