import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import {
  ListSpacePullReqQueryQueryParams,
  TypesPullReqRepo,
  useGetPrincipalQuery,
  useGetUserQuery,
  useListPrincipalsQuery
} from '@harnessio/code-service-client'
import { determineScope } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'
import {
  RepositoryType,
  PullRequestListPage as SandboxPullRequestListPage,
  type PRListFilters
} from '@harnessio/ui/views'

import { useRoutes } from '../../../framework/context/NavigationContext'
import { useIsMFE } from '../../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../../framework/hooks/useMFEContext'
import { parseAsInteger, useQueryState } from '../../../framework/hooks/useQueryState'
import { useAPIPath } from '../../../hooks/useAPIPath'
import { PathParams } from '../../../RouteDefinitions'
import { getPullRequestUrl, getScopeType } from '../../../utils/scope-url-utils'
import { buildPRFilters } from '../../pull-request/pull-request-utils'
import { usePullRequestListStore } from '../../pull-request/stores/pull-request-list-store'
import { usePopulateLabelStore } from '../../repo/labels/hooks/use-populate-label-store'
import { useLabelsStore } from '../stores/labels-store'

export default function PullRequestListPage() {
  const routes = useRoutes()
  const { setPullRequests, page, setPage, labelsQuery, prState, pageSize } = usePullRequestListStore()
  const { spaceId } = useParams<PathParams>()

  /* Query and Pagination */
  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [filterValues, setFilterValues] = useState<ListSpacePullReqQueryQueryParams>({ include_subspaces: false })
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState<string>()
  const [populateLabelStore, setPopulateLabelStore] = useState(false)
  const [searchParams] = useSearchParams()
  const defaultAuthorId = searchParams.get('created_by')
  const labelBy = searchParams.get('label_by')

  const oldPageRef = useRef(page)
  const [lastUpdatedPRFilter, setLastUpdatedPRFilter] = useState<{ updated_lt?: number; updated_gt?: number }>({})

  const { scope, renderUrl } = useMFEContext()
  const basename = `/ng${renderUrl}`
  const isMFE = useIsMFE()
  const { navigate } = useRouterContext()

  usePopulateLabelStore({ queryPage, query: labelsQuery, enabled: populateLabelStore, inherited: true })
  const getApiPath = useAPIPath()
  const { accountId, orgIdentifier, projectIdentifier } = scope

  const queryParams: ListSpacePullReqQueryQueryParams = useMemo(() => {
    return {
      ...filterValues,
      ...lastUpdatedPRFilter,
      state: prState,
      accountIdentifier: accountId,
      ...(orgIdentifier && { orgIdentifier }),
      ...(projectIdentifier && { projectIdentifier }),
      limit: pageSize,
      exclude_description: true,
      query: query ?? '',
      sort: 'updated',
      order: 'desc'
    }
  }, [accountId, orgIdentifier, projectIdentifier, query, filterValues, prState, lastUpdatedPRFilter, pageSize])

  const queryKey = ['pullRequests', queryParams, filterValues]

  /**
   *
   * Currently, this api is not present in openapi spec, so we are using fetch directly.
   * @todo replace with react query hook once present.
   */
  const fetchPullRequests = async (): Promise<{
    data: TypesPullReqRepo[]
    headers: Headers
  }> => {
    const apiPath = getApiPath('/api/v1/pullreq')
    const url = new URL(apiPath, window.location.origin)

    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          url.searchParams.append(key, String(item))
        })
      } else {
        url.searchParams.set(key, String(value))
      }
    })

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    return { data, headers: response.headers }
  }

  const { data: pullRequestData, isFetching: fetchingPullReqData } = useQuery({
    queryKey,
    queryFn: fetchPullRequests,
    select: ({ data, headers }) => ({
      pullRequestData: data
        .filter(item => item.pull_request)
        .map(item => ({
          ...item.pull_request,
          repo: {
            identifier: item.repository?.identifier || '',
            path: item.repository?.path || ''
          }
        })),
      headers
    })
  })

  const { data: { body: defaultSelectedAuthor } = {}, error: defaultSelectedAuthorError } = useGetPrincipalQuery(
    {
      queryParams: { page, accountIdentifier: accountId, ...filterValues },
      id: Number(searchParams.get('created_by'))
    },
    // Adding staleTime to avoid refetching the data if authorId gets modified in searchParams
    { enabled: !!defaultAuthorId, staleTime: Infinity, keepPreviousData: true }
  )

  // TODO: can we move this to some hook which is accessible globally ?
  const { data: { body: currentUser } = {} } = useGetUserQuery({})

  const { data: { body: principalDataList } = {}, isFetching: fetchingPrincipalData } = useListPrincipalsQuery(
    {
      queryParams: {
        page: 1,
        limit: 100,
        // @ts-expect-error : BE issue - not implemented
        type: 'user',
        query: principalsSearchQuery,
        accountIdentifier: accountId
      }
    },
    {
      enabled: principalsSearchQuery !== undefined
    }
  )

  useEffect(() => {
    if (oldPageRef.current === page) return

    if (oldPageRef.current < page) {
      setLastUpdatedPRFilter({
        updated_lt: pullRequestData?.pullRequestData?.at(-1)?.updated
      })
      oldPageRef.current = page
    } else if (oldPageRef.current > page) {
      setLastUpdatedPRFilter({
        updated_gt: pullRequestData?.pullRequestData?.at(0)?.updated
      })
      oldPageRef.current = page
    }
  }, [page, pullRequestData])

  useEffect(() => {
    if (pullRequestData) {
      setPullRequests(pullRequestData.pullRequestData, pullRequestData.headers)
    }
  }, [pullRequestData, setPullRequests])

  useEffect(() => {
    setQueryPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryPage, setPage])

  useEffect(() => {
    if (labelBy) {
      setPopulateLabelStore(true)
    }
  }, [labelBy])

  const handleOnClickPullRequest = ({
    prNumber,
    repo
  }: {
    prNumber?: number
    repo: Pick<RepositoryType, 'name' | 'path'>
  }) => {
    /** Scope where the pull request is currently displayed */
    const currentScopeType = getScopeType(scope)
    /** Scope where the pull request actually belongs to */
    const actualScopeType = determineScope({
      accountId,
      repoIdentifier: repo.name,
      repoPath: repo.path
    })

    const isSameScope = currentScopeType === actualScopeType
    const pullRequestPath = routes.toPullRequest({
      spaceId,
      repoId: repo.name,
      pullRequestId: prNumber?.toString()
    })

    if (!isMFE || isSameScope) {
      navigate(pullRequestPath)
    } else {
      const fullPath = `${basename}${getPullRequestUrl({
        repo,
        scope: {
          accountId,
          orgIdentifier,
          projectIdentifier
        },
        pullRequestSubPath: pullRequestPath
      })}`

      // TODO: Fix this properly to avoid full page refresh.
      // Currently, not able to navigate properly with React Router.
      window.location.href = fullPath
    }
  }

  return (
    <SandboxPullRequestListPage
      spaceId={spaceId || ''}
      isLoading={fetchingPullReqData}
      isPrincipalsLoading={fetchingPrincipalData}
      principalsSearchQuery={principalsSearchQuery}
      defaultSelectedAuthorError={defaultSelectedAuthorError}
      principalData={principalDataList}
      defaultSelectedAuthor={defaultSelectedAuthor}
      currentUser={currentUser}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      useLabelsStore={useLabelsStore}
      usePullRequestListStore={usePullRequestListStore}
      onFilterOpen={(filterValues: keyof PRListFilters) => {
        if (filterValues === 'label_by') {
          setPopulateLabelStore(true)
        }
      }}
      onFilterChange={filterData =>
        setFilterValues(
          buildPRFilters({
            filterData,
            scope,
            reviewerId: currentUser?.id
          })
        )
      }
      searchQuery={query}
      setSearchQuery={setQuery}
      onClickPullRequest={handleOnClickPullRequest}
      scope={scope}
    />
  )
}
