import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

import { CommitSuggestion } from '@harnessio/ui/views'

interface PRSuggestionsContextType {
  suggestionsBatch: CommitSuggestion[]
  suggestionToCommit?: CommitSuggestion
  isCommitDialogOpen: boolean
  setIsCommitDialogOpen: (isOpen: boolean) => void
  onCommitSuggestion: (suggestion: CommitSuggestion) => void
  onCommitSuggestionsBatch: () => void
  onCommitSuggestionSuccess: (refetchActivities: () => void) => void
  addSuggestionToBatch: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch: (commentId: number) => void
}

const PRSuggestionsContext = createContext<PRSuggestionsContextType | undefined>(undefined)

export const PRSuggestionsProvider = ({ children }: { children: ReactNode }) => {
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const [suggestionsBatch, setSuggestionsBatch] = useState<CommitSuggestion[]>([])
  const [suggestionToCommit, setSuggestionToCommit] = useState<CommitSuggestion>()

  const onCommitSuggestion = useCallback((suggestion: CommitSuggestion) => {
    setSuggestionToCommit(suggestion)
    setIsCommitDialogOpen(true)
  }, [])

  const onCommitSuggestionSuccess = useCallback((refetchActivities: () => void) => {
    setIsCommitDialogOpen(false)
    setSuggestionsBatch([])
    refetchActivities()
  }, [])

  const addSuggestionToBatch = useCallback((suggestion: CommitSuggestion) => {
    setSuggestionsBatch(prev => [...prev, suggestion])
  }, [])

  const removeSuggestionFromBatch = useCallback((commentId: number) => {
    setSuggestionsBatch(prev => prev.filter(s => s.comment_id !== commentId))
  }, [])

  const onCommitSuggestionsBatch = useCallback(() => setIsCommitDialogOpen(true), [])

  const value = {
    suggestionsBatch,
    suggestionToCommit,
    isCommitDialogOpen,
    setIsCommitDialogOpen,
    onCommitSuggestion,
    onCommitSuggestionsBatch,
    onCommitSuggestionSuccess,
    addSuggestionToBatch,
    removeSuggestionFromBatch
  }

  return <PRSuggestionsContext.Provider value={value}>{children}</PRSuggestionsContext.Provider>
}

export const usePRSuggestions = () => {
  const context = useContext(PRSuggestionsContext)
  if (!context) {
    throw new Error('usePRSuggestions must be used within a PRSuggestionsProvider')
  }
  return context
}
