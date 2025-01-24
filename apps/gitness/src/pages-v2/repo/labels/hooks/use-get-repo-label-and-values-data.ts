import { useEffect, useState } from 'react'

import { listRepoLabelValues, listSpaceLabelValues, useListRepoLabelsQuery } from '@harnessio/code-service-client'
import { LabelValuesType, LabelValueType } from '@harnessio/ui/views'

import { useGetRepoId } from '../../../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../../../framework/hooks/useGetSpaceParam'
import { useLabelsStore } from '../../../project/stores/labels-store'

export type LabelValuesResponseResultType = { key: string; data: LabelValueType[] } | { key: string; error: unknown }

export interface UseGetRepoLabelAndValuesDataProps {
  queryPage?: number
  query?: string
  enabled?: boolean
}

export const useGetRepoLabelAndValuesData = ({
  queryPage,
  query,
  enabled = true
}: UseGetRepoLabelAndValuesDataProps) => {
  const space_ref = useGetSpaceURLParam()
  const repo_ref = useGetRepoRef()
  const repoId = useGetRepoId()
  const [isLoadingValues, setIsLoadingValues] = useState(false)

  const {
    labels: storeLabels,
    setLabels,
    setValues,
    setRepoSpaceRef,
    resetLabelsAndValues,
    getParentScopeLabels
  } = useLabelsStore()

  const { data: { body: labels } = {}, isLoading: isLoadingRepoLabels } = useListRepoLabelsQuery(
    {
      repo_ref: repo_ref ?? '',
      queryParams: { page: queryPage || 1, limit: 10, query: query ?? '', inherited: getParentScopeLabels }
    },
    {
      enabled
    }
  )

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
   * Get values for each label
   *
   * Since there is no separate endpoint to fetch all label data along with values,
   * we collect the labels and make a request for each one to retrieve its values.
   */
  useEffect(() => {
    // I use useLabelsStore.getState().labels to retrieve data synchronously,
    // ensuring I get the latest state immediately without waiting for React's re-renders or state updates.
    // If I use storeLabels, the data in this hook will not be updated immediately after clearing the store.
    const syncStoreLabelsData = useLabelsStore.getState().labels
    if (!space_ref || !repo_ref || !syncStoreLabelsData.length) return

    const controller = new AbortController()
    const { signal } = controller

    const fetchAllLabelValues = async () => {
      setIsLoadingValues(true)

      const promises: Promise<LabelValuesResponseResultType>[] = syncStoreLabelsData.reduce((acc, item) => {
        if (item.value_count !== 0) {
          acc.push(
            item.scope === 0
              ? listRepoLabelValues({ repo_ref, key: item.key, signal }).then(
                  data => ({ key: item.key, data: data.body }),
                  error => ({ key: item.key, error })
                )
              : listSpaceLabelValues({ space_ref, key: item.key, signal }).then(
                  data => ({ key: item.key, data: data.body }),
                  error => ({ key: item.key, error })
                )
          )
        }

        return acc
      }, [])

      const results = await Promise.allSettled(promises)

      const values = results.reduce<LabelValuesType>((acc, result) => {
        if (result.status === 'fulfilled') {
          const data = result.value?.data
          data
            ? (acc[result.value.key] = data)
            : console.error(`Error fetching values for label ${result.value.key}:`, result.value?.error?.message)
        } else {
          console.error(`Error fetching values for label ${result.value.key}:`, result.reason)
        }

        return acc
      }, {})

      setValues(values)
      setIsLoadingValues(false)
    }

    fetchAllLabelValues()

    return () => {
      controller.abort()
    }
  }, [storeLabels, repo_ref, setValues, space_ref])

  /**
   * Set labels data from API to store
   */
  useEffect(() => {
    if (!labels) return

    setLabels(labels)
  }, [labels, setLabels])

  /**
   * Set space_ref & repo_ref to store
   */
  useEffect(() => {
    setRepoSpaceRef({
      repo_ref: repoId ?? '',
      space_ref: space_ref ?? ''
    })
  }, [space_ref, repoId, setRepoSpaceRef])

  return {
    isLoading: isLoadingRepoLabels || isLoadingValues,
    space_ref,
    repo_ref
  }
}
