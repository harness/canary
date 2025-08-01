import { useCallback, useMemo, useState } from 'react'

import { useAssignLabelMutation, useListLabelsQuery, useUnassignLabelMutation } from '@harnessio/code-service-client'
import { HandleAddLabelType, LabelAssignmentType } from '@harnessio/ui/views'

interface UsePrConversationLabelsProps {
  repoRef: string
  prId: number
  refetchData: () => void
}

/**
 * Hook that encapsulates all label-related operations
 */
export const usePrConversationLabels = ({ repoRef, prId, refetchData }: UsePrConversationLabelsProps) => {
  const [searchLabel, setSearchLabel] = useState('')

  const changeSearchLabel = useCallback((data: string) => {
    setSearchLabel(data)
  }, [])

  const { data: { body: appliedPRLabels } = {}, refetch: refetchPRLabels } = useListLabelsQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })

  const {
    data: { body: assignableLabels } = {},
    refetch: refetchAssignableLabels,
    isLoading: isLabelsLoading
  } = useListLabelsQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: { query: searchLabel, assignable: true }
  })

  const handleOnSuccess = () => {
    refetchPRLabels()
    refetchAssignableLabels()
    refetchData()
  }

  const { mutate: addLabel } = useAssignLabelMutation(
    { repo_ref: repoRef, pullreq_number: prId },
    { onSuccess: handleOnSuccess }
  )

  const { mutate: removeLabel } = useUnassignLabelMutation(
    { repo_ref: repoRef, pullreq_number: prId },
    { onSuccess: handleOnSuccess }
  )

  const handleAddLabel = useCallback((body: HandleAddLabelType) => addLabel({ body }), [addLabel])

  const handleRemoveLabel = useCallback((label_id: number) => removeLabel({ label_id }), [removeLabel])

  const appliedLabels = useMemo(() => {
    return (appliedPRLabels?.label_data || []) as LabelAssignmentType[]
  }, [appliedPRLabels])

  return {
    searchLabel,
    changeSearchLabel,
    assignableLabels,
    handleAddLabel,
    handleRemoveLabel,
    appliedLabels,
    refetchAssignableLabels,
    isLabelsLoading
  }
}
