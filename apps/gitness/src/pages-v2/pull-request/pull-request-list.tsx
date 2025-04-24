import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  ListPullReqQueryQueryParams,
  useGetPrincipalQuery,
  useListPrincipalsQuery,
  useListPullReqQuery
} from '@harnessio/code-service-client'
import { PullRequestListPage as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { useLabelsStore } from '../project/stores/labels-store'
import { usePopulateLabelStore } from '../repo/labels/hooks/use-populate-label-store'
import { usePullRequestListStore } from './stores/pull-request-list-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, setOpenClosePullRequests, labelsQuery } = usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [filterValues, setFilterValues] = useState<ListPullReqQueryQueryParams>({})
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [populateLabelStore, setPopulateLabelStore] = useState(false)
  const [searchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const labelBy = searchParams.get('label_by')
  const mfeContext = useMFEContext()
  usePopulateLabelStore({ queryPage, query: labelsQuery, enabled: populateLabelStore, inherited: true })

  const { data: { body: pullRequestData, headers } = {}, isFetching: fetchingPullReqData } = useListPullReqQuery(
    {
      queryParams: { page, query: query ?? '', ...filterValues },
      repo_ref: repoRef,
      stringifyQueryParamsOptions: {
        arrayFormat: 'repeat'
      }
    },
    { retry: false }
  )

  const { data: { body: defaultSelectedAuthor } = {}, error: defaultSelectedAuthorError } = useGetPrincipalQuery(
    {
      queryParams: { page, query: query ?? '', ...filterValues },
      id: Number(searchParams.get('created_by'))
    },
    // Adding staleTime to avoid refetching the data if authorId gets modified in searchParams
    { enabled: !!defaultAuthorId, staleTime: Infinity }
  )

  const { data: { body: principalDataList } = {}, isFetching: fetchingPrincipalData } = useListPrincipalsQuery(
    {
      queryParams: {
        page: 1,
        limit: 100,
        // @ts-expect-error : BE issue - not implemnted
        type: 'user',
        query: principalsSearchQuery,
        accountIdentifier: mfeContext?.scope?.accountId
      }
    },
    {
      enabled: principalsSearchQuery !== undefined
    }
  )

  useEffect(() => {
    if (pullRequestData) {
      setPullRequests(pullRequestData, headers)
      setOpenClosePullRequests(pullRequestData)
    }
  }, [pullRequestData, headers, setPullRequests])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  useEffect(() => {
    if (labelBy) {
      setPopulateLabelStore(true)
    }
  }, [labelBy])

  return (
    <SandboxPullRequestListPage
      repoId={repoId}
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      isPrincipalsLoading={fetchingPrincipalData}
      principalsSearchQuery={principalsSearchQuery}
      defaultSelectedAuthorError={defaultSelectedAuthorError}
      principalData={principalDataList}
      defaultSelectedAuthor={defaultSelectedAuthor}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      useLabelsStore={useLabelsStore}
      usePullRequestListStore={usePullRequestListStore}
      useTranslationStore={useTranslationStore}
      onFilterOpen={(filterValues: keyof PRListFilters) => {
        if (filterValues === 'label_by') {
          setPopulateLabelStore(true)
        }
      }}
      onFilterChange={(filterData: PRListFilters) => {
        setFilterValues(
          Object.entries(filterData).reduce<
            Record<string, ListPullReqQueryQueryParams[keyof ListPullReqQueryQueryParams]>
          >((acc, [key, value]) => {
            if ((key === 'created_gt' || key === 'created_lt') && value instanceof Date) {
              acc[key] = value.getTime().toString()
            }
            if (key === 'created_by' && typeof value === 'object' && 'value' in value) {
              acc[key] = value.value
            }
            if (key === 'label_by') {
              const defaultLabel: { labelId: string[]; valueId: string[] } = { labelId: [], valueId: [] }
              const { labelId, valueId } = Object.entries(value).reduce((labelAcc, [labelKey, value]) => {
                if (value === true) {
                  labelAcc.labelId.push(labelKey)
                } else if (value) {
                  labelAcc.valueId.push(value)
                }
                return labelAcc
              }, defaultLabel)

              acc['label_id'] = labelId.map(Number)
              acc['value_id'] = valueId.map(Number)
            }
            return acc
          }, {})
        )
      }}
      searchQuery={query}
      setSearchQuery={setQuery}
    />
  )
}
