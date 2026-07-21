import { createContext, ReactNode, useContext } from 'react'

import { AssistantRuntime } from '../../runtime/AssistantRuntime/AssistantRuntime'
import { StreamAdapter } from '../../types/adapters'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noopStreamAdapter: StreamAdapter = { stream: async function* () {} }

// Default runtime used whenever no AssistantRuntimeProvider is mounted (e.g. the host app has
// the chat feature disabled behind a flag). It behaves like a real, inert AssistantRuntime rather
// than null so every hook built on top of it (useCurrentThread, useThreadList, useContentFocus,
// useQuickActionScope, useRegisterQuickActions, ...) can be called unconditionally without
// crashing pages that don't know/care whether chat is enabled.
const noopAssistantRuntime = new AssistantRuntime({ streamAdapter: noopStreamAdapter })

const AssistantRuntimeContext = createContext<AssistantRuntime>(noopAssistantRuntime)

export interface AssistantRuntimeProviderProps {
  runtime: AssistantRuntime
  children: ReactNode
}

export function AssistantRuntimeProvider({ runtime, children }: AssistantRuntimeProviderProps): JSX.Element {
  return <AssistantRuntimeContext.Provider value={runtime}>{children}</AssistantRuntimeContext.Provider>
}

export function useAssistantRuntimeContext(): AssistantRuntime {
  return useContext(AssistantRuntimeContext)
}
