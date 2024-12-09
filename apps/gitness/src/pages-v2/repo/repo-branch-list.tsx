import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import {
  //   ListBranchesQueryQueryParams,
  // TypesBranchExtended,
  useCalculateCommitDivergenceMutation,
  useFindRepositoryQuery,
  useListBranchesQuery
} from '@harnessio/code-service-client'
import { RepoBranchListView } from '@harnessio/ui/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { orderSortDate, PageResponseHeader } from '../../types'
import { useRepoBranchStore } from './stores/repo-branch-store'

// import CreateBranchDialog from './repo-branch-create'

// const sortOptions = [
//   { name: 'Date', value: 'date' },
//   { name: 'Name', value: 'name' }
// ]

export function RepoBranchesListPage() {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { setBranchesData, setDefaultBranch, setBranchDivergence } = useRepoBranchStore()

  //   const { sort } = useCommonFilter<ListBranchesQueryQueryParams['sort']>()
  const [query, _setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  //   const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  //   const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })
  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery(
    {
      repo_ref: repoRef
    },
    {
      onSuccess: data => {
        if (data.body) {
          setDefaultBranch(data.body)
        }
      }
    }
  )

  const { isLoading, data: { body: branches, headers } = {} } = useListBranchesQuery({
    queryParams: { page, query, order: orderSortDate.DESC, include_commit: true },
    repo_ref: repoRef
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  const { data: { body: branchDivergence = [] } = {}, mutate: calculateBranchDivergence } =
    useCalculateCommitDivergenceMutation(
      {
        repo_ref: repoRef
      },
      {
        onSuccess: data => {
          if (data.body) {
            setBranchDivergence(data.body)
            if (branches) {
              setBranchesData(branches, data.body, repoMetadata?.default_branch)
            }
          }
        }
      }
    )

  useEffect(() => {
    if (branches?.length !== 0 && branches !== undefined) {
      calculateBranchDivergence({
        body: {
          requests: branches?.map(branch => ({ from: branch.name, to: repoMetadata?.default_branch })) || []
        }
      })
    }
  }, [calculateBranchDivergence, branches, repoMetadata?.default_branch])

  //   useEffect(() => {
  //     if (branches) {
  //       setBranchesData(branches, branchDivergence, repoMetadata?.default_branch)
  //     }
  //   }, [branches, branchDivergence, repoMetadata?.default_branch, setBranchesData])

  return (
    <RepoBranchListView
      isLoading={isLoading}
      repoId={repoId}
      spaceId={spaceId}
      //   repoMetadata={repoMetadata}
      //   branches={branches}
      //   branchDivergence={branchDivergence}
      useRepoBranchStore={useRepoBranchStore}
      xNextPage={xNextPage}
      xPrevPage={xPrevPage}
      page={page}
      setPage={setPage}
      useTranslationStore={useTranslationStore}
    />
  )
}
