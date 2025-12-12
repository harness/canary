import { useMemo } from 'react'

import { AssistantRuntime, AssistantRuntimeProvider } from '../../../src'
import { MockStreamAdapter } from '../adapters/MockStreamAdapter'
import { defaultPlugin } from '../plugins/defaultPlugin'

export const ChatRuntime = ({ children }: { children: React.ReactNode }) => {
  const runtime = useMemo(() => {
    const assistantRuntime = new AssistantRuntime({
      streamAdapter: new MockStreamAdapter(),
      plugins: [defaultPlugin]
    })

    return assistantRuntime
  }, [])

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>
}
