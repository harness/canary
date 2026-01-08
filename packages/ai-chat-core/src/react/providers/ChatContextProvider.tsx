import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

import { ChatContextItem, ChatContextMap, ChatContextValue } from '../../types/context'

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export interface ChatContextProviderProps {
  children: ReactNode
}

export function ChatContextProvider({ children }: ChatContextProviderProps): JSX.Element {
  const [contexts, setContexts] = useState<ChatContextMap>({})

  const setContext = useCallback((id: string, context: Omit<ChatContextItem, 'id'> | null) => {
    setContexts(prev => {
      if (context === null) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [id]: { id, ...context }
      }
    })
  }, [])

  const removeContext = useCallback((id: string) => {
    setContexts(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }, [])

  const getContextData = useCallback(() => {
    return Object.values(contexts).reduce(
      (acc, context) => {
        // Stringify non-string values for backend compatibility
        const stringifiedData = Object.entries(context.data).reduce(
          (dataAcc, [key, value]) => {
            return {
              ...dataAcc,
              [key]: typeof value === 'string' ? value : JSON.stringify(value)
            }
          },
          {} as Record<string, unknown>
        )
        return { ...acc, ...stringifiedData }
      },
      {} as Record<string, unknown>
    )
  }, [contexts])

  const clearContexts = useCallback(() => {
    setContexts({})
  }, [])

  const value = useMemo(
    () => ({
      contexts,
      setContext,
      removeContext,
      getContextData,
      clearContexts
    }),
    [contexts, setContext, removeContext, getContextData, clearContexts]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider')
  }
  return context
}
