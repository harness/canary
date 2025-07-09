import { useEffect, useState } from 'react'

import { listSpaceLabelValues, useListSpaceLabelsQuery } from '@harnessio/code-service-client'
import { ILabelType, LabelValuesType, LabelValueType } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../../../framework/hooks/useGetSpaceParam'
import { PageResponseHeader } from '../../../../types'
import { useLabelsStore } from '../../stores/labels-store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LabelValuesResponseResultType = { key: string; data: LabelValueType[] } | { key: string; error: any }

const isDataResponse = (value: LabelValuesResponseResultType): value is { key: string; data: LabelValueType[] } => {
  return 'data' in value
}

export interface UseFillLabelStoreWithProjectLabelValuesDataProps {
  queryPage?: number
  query?: string
  enabled?: boolean
}

export const useFillLabelStoreWithProjectLabelValuesData = ({
  queryPage,
  query,
  enabled = true
}: UseFillLabelStoreWithProjectLabelValuesDataProps) => {
  const space_ref = useGetSpaceURLParam()
  const [isLoadingValues, setIsLoadingValues] = useState(false)

  const {
    labels: storeLabels,
    setLabels,
    setValues,
    setRepoSpaceRef,
    resetLabelsAndValues,
    setIsLoading
  } = useLabelsStore()

  const { data: { body: labels, headers } = {}, isLoading: isLoadingSpaceLabels } = useListSpaceLabelsQuery(
    {
      space_ref: `${space_ref}/+`,
      queryParams: { page: queryPage || 1, limit: 10, query: query ?? '' }
    },
    { enabled }
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
    if (!space_ref || !syncStoreLabelsData.length) return

    const controller = new AbortController()
    const { signal } = controller

    const fetchAllLabelValues = async () => {
      setIsLoadingValues(true)

      const promises = syncStoreLabelsData.reduce<Promise<LabelValuesResponseResultType>[]>((acc, item) => {
        if (item.value_count !== 0) {
          acc.push(
            listSpaceLabelValues({ space_ref: `${space_ref}/+`, key: item.key, signal }).then(
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
  }, [storeLabels, space_ref, setValues])

  /**
   * Set labels data from API to store
   */
  useEffect(() => {
    if (!labels) return

    const totalItems = parseInt(headers?.get(PageResponseHeader.xTotal) || '0')
    const pageSize = parseInt(headers?.get(PageResponseHeader.xPerPage) || '10')

    setLabels(labels as ILabelType[], { totalItems, pageSize })
  }, [labels, setLabels, headers])

  /**
   * Set space_ref to store
   */
  useEffect(() => {
    setRepoSpaceRef({ space_ref: space_ref ?? '' })
  }, [space_ref, setRepoSpaceRef])

  /**
   * Set loading state to store
   */
  useEffect(() => {
    setIsLoading(enabled ? isLoadingSpaceLabels : isLoadingValues)
  }, [isLoadingSpaceLabels, isLoadingValues, setIsLoading, query, enabled])

  return { space_ref }
}
