import { useEffect, useState } from 'react'

import { ThreadRuntime } from '../../runtime/ThreadRuntime/ThreadRuntime'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useCurrentThread(): ThreadRuntime {
  const runtime = useAssistantRuntime()
  const thread = runtime.threads.getMainThread()

  const [, forceUpdate] = useState({})

  useEffect(() => {
    const unsubscribe = thread.subscribe(() => {
      forceUpdate({})
    })

    return unsubscribe
  }, [thread])

  return thread
}
