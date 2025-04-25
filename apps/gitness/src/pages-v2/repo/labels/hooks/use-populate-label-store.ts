import { useEffect } from 'react'

import { useGetRepoId } from '../../../../framework/hooks/useGetRepoId'
import { useLabelsStore } from '../../../project/stores/labels-store'
import { useGetRepoLabelAndValuesData } from './use-get-repo-label-and-values-data'

export interface UsePopulateLabelStoreProps {
  queryPage?: number
  query?: string
  enabled?: boolean
  inherited?: boolean
}

export const usePopulateLabelStore = ({ queryPage, query, enabled = true, inherited }: UsePopulateLabelStoreProps) => {
  const repoId = useGetRepoId()

  const { setLabels, setValues, setRepoSpaceRef, resetLabelsAndValues, setIsLoading, getParentScopeLabels } =
    useLabelsStore()

  const {
    isLoading: isDataLoading,
    space_ref,
    repo_ref,
    labels,
    values
  } = useGetRepoLabelAndValuesData({ queryPage, query, enabled, inherited: inherited || getParentScopeLabels })

  /**
   * Resetting the store state for labels and values
   * because the same data retrieval endpoint is used for both the edit form and the list.
   * TODO: Refactor the code once the API for fetching a single label with its values is available.
   */
  useEffect(() => {
    return () => {
      resetLabelsAndValues()
    }
  }, [resetLabelsAndValues])

  /**
   * Set space_ref & repo_ref to store
   */
  useEffect(() => {
    setRepoSpaceRef({
      repo_ref: repoId ?? '',
      space_ref: space_ref ?? ''
    })
  }, [space_ref, repoId, setRepoSpaceRef])

  /**
   * Set labels data from API to store
   */
  useEffect(() => {
    setLabels(labels)
  }, [labels, setLabels])

  /**
   * Set values data from API to store
   */
  useEffect(() => {
    setValues(values)
  }, [values, setValues])

  /**
   * Set loading state to store
   */
  useEffect(() => {
    setIsLoading(enabled && isDataLoading)
  }, [isDataLoading, setIsLoading, query, enabled])

  return { space_ref, repo_ref }
}
