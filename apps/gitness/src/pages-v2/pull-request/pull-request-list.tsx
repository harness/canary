import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  ListPullReqQueryQueryParams,
  useGetPrincipalQuery,
  useListPrincipalsQuery,
  useListPullReqQuery,
  usePrCandidatesQuery
} from '@harnessio/code-service-client'
import { PullRequestListPage as SandboxPullRequestListPage, type PRListFilters } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../framework/hooks/useQueryState'
import { useGitRef } from '../../hooks/useGitRef'
import { PathParams } from '../../RouteDefinitions'
import { useLabelsStore } from '../project/stores/labels-store'
import { usePopulateLabelStore } from '../repo/labels/hooks/use-populate-label-store'
import { buildPRFilters } from './pull-request-utils'
import { usePullRequestListStore } from './stores/pull-request-list-store'

export default function PullRequestListPage() {
  const repoRef = useGetRepoRef() ?? ''
  const { setPullRequests, page, setPage, setOpenClosePullRequests, labelsQuery } = usePullRequestListStore()
  const { spaceId, repoId } = useParams<PathParams>()
  const { repoData } = useGitRef()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [filterValues, setFilterValues] = useState<ListPullReqQueryQueryParams>({})
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [populateLabelStore, setPopulateLabelStore] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const labelBy = searchParams.get('label_by')
  const { scope } = useMFEContext()
  const { accountId = '', orgIdentifier, projectIdentifier } = scope || {}
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
        accountIdentifier: accountId
      }
    },
    {
      enabled: principalsSearchQuery !== undefined
    }
  )

  const { data: { body: prCandidateBranches } = {} } = usePrCandidatesQuery({ repo_ref: repoRef, queryParams: {} })

  const onLabelClick = (labelId: number) => {
    // Update filter values with the label ID for API call
    setFilterValues(prevFilters => {
      // Get current label IDs or empty array
      const currentLabelIds = prevFilters.label_id || []

      // Toggle the label: remove if exists, add if doesn't exist
      let newLabelIds: number[]
      if (currentLabelIds.includes(labelId)) {
        newLabelIds = currentLabelIds.filter(id => id !== labelId)
      } else {
        newLabelIds = [...currentLabelIds, labelId]
      }

      const newParams = new URLSearchParams(searchParams)

      if (newLabelIds.length > 0) {
        const labelByValue = newLabelIds.map(id => `${id}:true`).join(';')
        newParams.set('label_by', labelByValue)
      } else {
        newParams.delete('label_by')
      }

      setSearchParams(newParams)

      return {
        ...prevFilters,
        label_id: newLabelIds
      }
    })
  }

  useEffect(() => {
    if (pullRequestData) {
      const validPullRequests = Array.isArray(pullRequestData) ? pullRequestData.filter(pr => pr !== null) : []
      setPullRequests(validPullRequests, headers)
      setOpenClosePullRequests(validPullRequests)
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

  const _scope = {
    accountId: accountId || '',
    orgIdentifier: orgIdentifier,
    projectIdentifier: projectIdentifier
  }

  return (
    <SandboxPullRequestListPage
      repoId={repoId}
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      isPrincipalsLoading={fetchingPrincipalData}
      prCandidateBranches={prCandidateBranches}
      principalsSearchQuery={principalsSearchQuery}
      defaultSelectedAuthorError={defaultSelectedAuthorError}
      principalData={principalDataList}
      defaultSelectedAuthor={defaultSelectedAuthor}
      repository={repoData}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      useLabelsStore={useLabelsStore}
      usePullRequestListStore={usePullRequestListStore}
      onFilterOpen={(filterValues: keyof PRListFilters) => {
        if (filterValues === 'label_by') {
          setPopulateLabelStore(true)
        }
      }}
      onFilterChange={filterData =>
        setFilterValues(buildPRFilters(filterData, { accountId, orgIdentifier, projectIdentifier }))
      }
      searchQuery={query}
      setSearchQuery={setQuery}
      onLabelClick={onLabelClick}
      toPullRequest={({ prNumber }) => prNumber.toString()}
      scope={{ accountId, orgIdentifier, projectIdentifier }}
    />
  )
}
