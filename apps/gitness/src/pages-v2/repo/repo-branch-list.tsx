import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash-es'

import {
  useCalculateCommitDivergenceMutation,
  useDeleteBranchMutation,
  useFindRepositoryQuery,
  useListBranchesQuery
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { RepoBranchListView } from '@harnessio/ui/views'

import { CreateBranchDialog } from '../../components-v2/create-branch-dialog'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useQueryState } from '../../framework/hooks/useQueryState'
import { useRuleViolationCheck } from '../../framework/hooks/useRuleViolationCheck'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { PathParams } from '../../RouteDefinitions'
import { orderSortDate, PageResponseHeader } from '../../types'
import { normalizeGitRef } from '../../utils/git-utils'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { transformBranchList } from './transform-utils/branch-transform'

export function RepoBranchesListPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const queryClient = useQueryClient()

  const {
    page,
    setPage,
    setBranchList,
    setDefaultBranch,
    setSelectedBranchTag,
    setSpaceIdAndRepoId,
    setPaginationFromHeaders,
    branchList,
    pageSize
  } = useRepoBranchesStore()

  const [query, setQuery] = useQueryState('query')
  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const [deleteBranchName, setDeleteBranchName] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { isLoading: isLoadingBranches, data: { body: branches, headers } = {} } = useListBranchesQuery({
    queryParams: {
      page: queryPage,
      limit: pageSize,
      query: query ?? '',
      order: orderSortDate.DESC,
      sort: 'date',
      include_commit: true,
      include_pullreqs: true,
      include_checks: true
    },
    repo_ref: repoRef
  })

  const {
    isLoading: isLoadingDivergence,
    data: { body: _branchDivergence = [] } = {},
    mutate: calculateBranchDivergence
  } = useCalculateCommitDivergenceMutation(
    { repo_ref: repoRef },
    {
      onSuccess: data => {
        if (data.body && branches) {
          setBranchList(transformBranchList(branches, repoMetadata?.default_branch, data.body))
        }
      }
    }
  )

  const handleInvalidateBranchList = () => {
    queryClient.invalidateQueries({ queryKey: ['listBranches'] })
  }

  const handleResetDeleteBranch = () => {
    setIsDeleteDialogOpen(false)
    setDeleteBranchName(null)
    if (deleteBranchError) {
      resetDeleteBranch()
    }
    resetViolation()
  }

  const handleSetDeleteBranch = (branchName: string) => {
    setDeleteBranchName(branchName)
    setIsDeleteDialogOpen(true)
  }

  const {
    mutateAsync: deleteBranch,
    isLoading: isDeletingBranch,
    error: deleteBranchError,
    reset: resetDeleteBranch
  } = useDeleteBranchMutation({ repo_ref: repoRef })

  const { violation, bypassable, bypassed, setAllStates, resetViolation } = useRuleViolationCheck()

  const handleDeleteBranch = (branch_name: string) => {
    deleteBranch({ branch_name, queryParams: { dry_run_rules: false, bypass_rules: bypassed } })
      .then(() => {
        setIsDeleteDialogOpen(false)
        handleResetDeleteBranch()
        handleInvalidateBranchList()
        resetViolation()
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleDeleteBranchWithDryRun = (branch_name: string) => {
    deleteBranch({ branch_name, queryParams: { dry_run_rules: true, bypass_rules: false } })
      .then(res => {
        if (!isEmpty(res?.body?.rule_violations)) {
          setAllStates({
            violation: true,
            bypassed: true,
            bypassable: res?.body?.rule_violations?.[0]?.bypassable
          })
        } else setAllStates({ bypassable: true })
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (isDeleteDialogOpen && deleteBranchName) {
      handleDeleteBranchWithDryRun(deleteBranchName)
    }
  }, [isDeleteDialogOpen, deleteBranchName])

  useEffect(() => {
    setPaginationFromHeaders(
      parseInt(headers?.get(PageResponseHeader.xNextPage) || ''),
      parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')
    )
  }, [headers, setPaginationFromHeaders])

  useEffect(() => {
    if (!branches) return

    if (branches?.length === 0) {
      return setBranchList([])
    }

    calculateBranchDivergence({
      body: {
        requests:
          branches?.map(branch => ({
            from: normalizeGitRef(branch.name),
            to: normalizeGitRef(repoMetadata?.default_branch)
          })) || []
      }
    })
  }, [calculateBranchDivergence, branches, repoMetadata?.default_branch])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId, setSpaceIdAndRepoId])

  // useEffect(() => {
  //   setDefaultBranch(repoMetadata?.default_branch || '')
  // }, [repoMetadata, setDefaultBranch])

  useEffect(() => {
    const defaultBranch = branchList?.find(branch => branch.default)
    setSelectedBranchTag({
      name: defaultBranch?.name || repoMetadata?.default_branch || '',
      sha: defaultBranch?.sha || '',
      default: true
    })
    setDefaultBranch(repoMetadata?.default_branch ?? '')
  }, [branchList, repoMetadata?.default_branch])

  return (
    <>
      <RepoBranchListView
        isLoading={isLoadingBranches || isLoadingDivergence}
        useRepoBranchesStore={useRepoBranchesStore}
        setCreateBranchDialogOpen={setCreateBranchDialogOpen}
        searchQuery={query}
        setSearchQuery={setQuery}
        // toBranchRules={() => routes.toRepoBranchRules({ spaceId, repoId })}
        toPullRequestCompare={({ diffRefs }: { diffRefs: string }) =>
          routes.toPullRequestCompare({ spaceId, repoId, diffRefs })
        }
        toPullRequest={({ pullRequestId }: { pullRequestId: number }) =>
          routes.toPullRequest({ spaceId, repoId, pullRequestId: pullRequestId.toString() })
        }
        toCode={({ branchName }: { branchName: string }) => `${routes.toRepoFiles({ spaceId, repoId })}/${branchName}`}
        onDeleteBranch={handleSetDeleteBranch}
      />

      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => setCreateBranchDialogOpen(false)}
        onSuccess={handleInvalidateBranchList}
      />

      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onClose={handleResetDeleteBranch}
        deleteFn={handleDeleteBranch}
        error={deleteBranchError ? { message: deleteBranchError?.message ?? '' } : null}
        type="branch"
        identifier={deleteBranchName ?? undefined}
        isLoading={isDeletingBranch}
        violation={violation}
        bypassable={bypassable}
      />
    </>
  )
}
