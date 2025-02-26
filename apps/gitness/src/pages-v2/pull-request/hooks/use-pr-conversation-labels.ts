import { useCallback, useMemo, useState } from 'react'

import { useAssignLabelMutation, useListLabelsQuery, useUnassignLabelMutation } from '@harnessio/code-service-client'
import { HandleAddLabelType, LabelAssignmentType } from '@harnessio/ui/views'

import { useGetRepoLabelAndValuesData } from '../../repo/labels/hooks/use-get-repo-label-and-values-data'

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

  const {
    labels,
    values: labelsValues,
    refetchLabels
  } = useGetRepoLabelAndValuesData({
    query: searchLabel,
    inherited: true,
    limit: 100
  })

  const { data: { body: prLabels } = {}, refetch: refetchPRLabels } = useListLabelsQuery({
    repo_ref: repoRef,
    pullreq_number: prId,
    queryParams: {}
  })

  const handleOnSuccess = () => {
    refetchPRLabels()
    refetchLabels()
    refetchData()
  }

  const { mutate: addLabel } = useAssignLabelMutation(
    {
      repo_ref: repoRef,
      pullreq_number: prId
    },
    {
      onSuccess: handleOnSuccess
    }
  )

  const { mutate: removeLabel } = useUnassignLabelMutation(
    {
      repo_ref: repoRef,
      pullreq_number: prId
    },
    {
      onSuccess: handleOnSuccess
    }
  )

  const handleAddLabel = useCallback((body: HandleAddLabelType) => addLabel({ body }), [addLabel])

  const handleRemoveLabel = useCallback((label_id: number) => removeLabel({ label_id }), [removeLabel])

  const appliedLabels = useMemo(() => {
    return (prLabels?.label_data || []) as LabelAssignmentType[]
  }, [prLabels])

  return {
    searchLabel,
    changeSearchLabel,
    labels,
    labelsValues,
    handleAddLabel,
    handleRemoveLabel,
    appliedLabels,
    refetchLabels
  }
}
