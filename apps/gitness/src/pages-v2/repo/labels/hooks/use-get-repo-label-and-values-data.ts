import { useEffect, useMemo, useState } from 'react'

import { listRepoLabelValues, listSpaceLabelValues, useListRepoLabelsQuery } from '@harnessio/code-service-client'
import { ILabelType, LabelValuesType, LabelValueType } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../../../framework/hooks/useGetSpaceParam'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LabelValuesResponseResultType = { key: string; data: LabelValueType[] } | { key: string; error: any }

const isDataResponse = (value: LabelValuesResponseResultType): value is { key: string; data: LabelValueType[] } => {
  return 'data' in value
}

export interface UseGetRepoLabelAndValuesDataProps {
  queryPage?: number
  query?: string
  enabled?: boolean
  inherited?: boolean
  limit?: number
}

export const useGetRepoLabelAndValuesData = ({
  queryPage,
  query,
  enabled = true,
  inherited = false,
  limit = 10
}: UseGetRepoLabelAndValuesDataProps) => {
  const space_ref = useGetSpaceURLParam()
  const repo_ref = useGetRepoRef()
  const [isLoadingValues, setIsLoadingValues] = useState(false)
  const [values, setValues] = useState<LabelValuesType>({})

  const {
    data: { body: labels, headers } = {},
    isLoading: isLoadingRepoLabels,
    refetch: refetchLabels
  } = useListRepoLabelsQuery(
    {
      repo_ref: repo_ref ?? '',
      queryParams: { page: queryPage || 1, limit, query: query ?? '', inherited }
    },
    { enabled }
  )

  const labelsData = useMemo(() => (labels || []) as ILabelType[], [labels])

  /**
   * Get values for each label
   *
   * Since there is no separate endpoint to fetch all label data along with values,
   * we collect the labels and make a request for each one to retrieve its values.
   */
  useEffect(() => {
    // // I use useLabelsStore.getState().labels to retrieve data synchronously,
    // // ensuring I get the latest state immediately without waiting for React's re-renders or state updates.
    // // If I use storeLabels, the data in this hook will not be updated immediately after clearing the store.
    // const syncStoreLabelsData = useLabelsStore.getState().labels

    if (!space_ref || !repo_ref || !labelsData.length) return

    const controller = new AbortController()
    const { signal } = controller

    const fetchAllLabelValues = async () => {
      setIsLoadingValues(true)

      const promises = labelsData.reduce<Promise<LabelValuesResponseResultType>[]>((acc, item) => {
        if (item.value_count !== 0) {
          acc.push(
            item.scope === 0
              ? listRepoLabelValues({ repo_ref, key: item.key, signal }).then(
                  data => ({ key: item.key, data: data.body as LabelValueType[] }),
                  error => ({ key: item.key, error })
                )
              : listSpaceLabelValues({ space_ref: `${space_ref}/+`, key: item.key, signal }).then(
                  data => ({ key: item.key, data: data.body as LabelValueType[] }),
                  error => ({ key: item.key, error })
                )
          )
        }

        return acc
      }, [])

      const results = await Promise.allSettled(promises)

      const values = results.reduce<LabelValuesType>((acc, result) => {
        if (result.status !== 'fulfilled') {
          console.error(`Error fetching values:`, result.reason)
          return acc
        }

        if (isDataResponse(result.value)) {
          acc[result.value.key] = result.value.data
        } else {
          console.error(`Error fetching values for label ${result.value.key}:`, result.value?.error?.message)
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
  }, [labelsData, repo_ref, space_ref])

  return {
    isLoading: isLoadingRepoLabels || isLoadingValues,
    space_ref,
    repo_ref,
    labels: labelsData,
    values,
    refetchLabels,
    headers
  }
}
