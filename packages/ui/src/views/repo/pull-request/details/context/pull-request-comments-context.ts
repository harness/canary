import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export interface ExpandedCommentsContextType {
  expandedComments: Set<number>
  toggleExpanded: (commentId: number) => void
  isExpanded: (commentId: number) => boolean
}

export const ExpandedCommentsContext = createContext<ExpandedCommentsContextType | undefined>(undefined)

export const useExpandedComments = () => {
  const context = useContext(ExpandedCommentsContext)
  if (!context) {
    throw new Error('useExpandedComments must be used within ExpandedCommentsProvider')
  }
  return context
}

export const useExpandedCommentsContext = () => {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())

  const toggleExpanded = useCallback((commentId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev)
      if (next.has(commentId)) {
        next.delete(commentId)
      } else {
        next.add(commentId)
      }
      return next
    })
  }, [])

  const isExpanded = useCallback(
    (commentId: number) => {
      return expandedComments.has(commentId)
    },
    [expandedComments]
  )

  const contextValue = useMemo(
    () => ({
      expandedComments,
      toggleExpanded,
      isExpanded
    }),
    [expandedComments, toggleExpanded, isExpanded]
  )

  return contextValue
}
