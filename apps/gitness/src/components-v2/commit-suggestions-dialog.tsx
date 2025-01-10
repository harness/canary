import { useState } from 'react'

import {
  CommentApplySuggestionsOkResponse,
  useCommentApplySuggestionsMutation,
  UsererrorError
} from '@harnessio/code-service-client'
import {
  CommitSuggestionsDialog as CommitSuggestionsDialogComp,
  CommitSuggestionsFormType
} from '@harnessio/ui/components'
import { CommitSuggestion } from '@harnessio/ui/views'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'

export type CommitSuggestionsOnSuccess = (response: CommentApplySuggestionsOkResponse) => void

interface CommitDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: CommitSuggestionsOnSuccess
  suggestions: CommitSuggestion[] | null
  prId: number
}

export default function CommitSuggestionsDialog({
  open,
  onClose,
  onSuccess,
  suggestions = null,
  prId
}: CommitDialogProps) {
  const repoRef = useGetRepoRef()
  const [error, setError] = useState<UsererrorError>()
  const { mutateAsync: applyChanges } = useCommentApplySuggestionsMutation({})

  const commitTitlePlaceholder = 'Apply suggestion from code review'

  const onSubmit = async (formValues: CommitSuggestionsFormType) => {
    const { message, title } = formValues
    const data = {
      suggestions: suggestions,
      title: title || commitTitlePlaceholder,
      message: message
    }

    applyChanges({
      repo_ref: repoRef,
      pullreq_number: prId,
      body: { ...data }
    })
      .then(response => {
        onSuccess(response.body)
      })
      .catch(_error => {
        setError(_error as UsererrorError)
      })
  }

  return (
    <CommitSuggestionsDialogComp
      isOpen={open}
      onClose={onClose}
      onFormSubmit={onSubmit}
      commitTitlePlaceHolder={commitTitlePlaceholder}
      error={error}
      isSubmitting={false}
    />
  )
}
