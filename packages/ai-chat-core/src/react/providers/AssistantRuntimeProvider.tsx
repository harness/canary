import { createContext, ReactNode, useContext } from 'react'

import { AssistantRuntime } from '../../runtime/AssistantRuntime/AssistantRuntime'

const AssistantRuntimeContext = createContext<AssistantRuntime | null>(null)

export interface AssistantRuntimeProviderProps {
  runtime: AssistantRuntime
  children: ReactNode
}

export function AssistantRuntimeProvider({ runtime, children }: AssistantRuntimeProviderProps): JSX.Element {
  return <AssistantRuntimeContext.Provider value={runtime}>{children}</AssistantRuntimeContext.Provider>
}

export function useAssistantRuntimeContext(): AssistantRuntime {
  const runtime = useContext(AssistantRuntimeContext)
  if (!runtime) {
    throw new Error('useAssistantRuntimeContext must be used within AssistantRuntimeProvider')
  }
  return runtime
}
