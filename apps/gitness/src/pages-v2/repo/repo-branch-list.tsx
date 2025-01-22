import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  useCalculateCommitDivergenceMutation,
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useFindRepositoryQuery,
  useListBranchesQuery
} from '@harnessio/code-service-client'
import { CreateBranchFormFields, RepoBranchListView } from '@harnessio/ui/views'

import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { PathParams } from '../../RouteDefinitions'
import { orderSortDate, PageResponseHeader } from '../../types'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { transformBranchList } from './transform-utils/branch-transform'

export function RepoBranchesListPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const queryClient = useQueryClient()

  const { page, setPage, setBranchList, setDefaultBranch, setSpaceIdAndRepoId, setPaginationFromHeaders } =
    useRepoBranchesStore()

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)

  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({
    repo_ref: repoRef
  })

  const { isLoading, data: { body: branches, headers } = {} } = useListBranchesQuery({
    queryParams: { page, query: query ?? '', order: orderSortDate.DESC, include_commit: true },
    repo_ref: repoRef
  })

  const { data: { body: branchDivergence = [] } = {}, mutate: calculateBranchDivergence } =
    useCalculateCommitDivergenceMutation(
      {
        repo_ref: repoRef
      },
      {
        onSuccess: data => {
          if (data.body) {
            if (branches) {
              setBranchList(transformBranchList(branches, repoMetadata?.default_branch, data.body))
            }
          }
        }
      }
    )

  const { mutateAsync: saveBranch, isLoading: isCreatingBranch, error: createBranchError } = useCreateBranchMutation({})
  const { mutateAsync: deleteBranch } = useDeleteBranchMutation({ queryParams: {} })

  const onSubmit = async (formValues: CreateBranchFormFields) => {
    const { name, target } = formValues

    await saveBranch({
      repo_ref: repoRef,
      body: { name, target, bypass_rules: false }
    })
    queryClient.invalidateQueries({ queryKey: ['listBranches'] })
    setCreateBranchDialogOpen(false)
  }

  const onDeleteBranch = async (branchName: string) => {
    await deleteBranch({
      repo_ref: repoRef,
      branch_name: branchName
    })
    queryClient.invalidateQueries({ queryKey: ['listBranches'] })
  }

  useEffect(() => {
    setPaginationFromHeaders(
      parseInt(headers?.get(PageResponseHeader.xNextPage) || ''),
      parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')
    )
  }, [headers, setPaginationFromHeaders])

  useEffect(() => {
    setQueryPage(page)
  }, [page, setPage, queryPage])

  useEffect(() => {
    if (branches?.length !== 0 && branches !== undefined) {
      calculateBranchDivergence({
        body: {
          requests: branches?.map(branch => ({ from: branch.name, to: repoMetadata?.default_branch })) || []
        }
      })
    }
  }, [calculateBranchDivergence, branches, repoMetadata?.default_branch])

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId, setSpaceIdAndRepoId])

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repoMetadata?.default_branch, branchDivergence))
    }
  }, [branches, repoMetadata?.default_branch, setBranchList])

  useEffect(() => {
    setDefaultBranch(repoMetadata?.default_branch || '')
  }, [repoMetadata, setDefaultBranch])

  return (
    <RepoBranchListView
      toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
      isLoading={isLoading}
      isCreatingBranch={isCreatingBranch}
      onSubmit={onSubmit}
      useRepoBranchesStore={useRepoBranchesStore}
      useTranslationStore={useTranslationStore}
      isCreateBranchDialogOpen={isCreateBranchDialogOpen}
      setCreateBranchDialogOpen={setCreateBranchDialogOpen}
      searchQuery={query}
      setSearchQuery={setQuery}
      createBranchError={createBranchError?.message}
      toBranchRules={() => routes.toRepoBranchRules({ spaceId, repoId })}
      toPullRequestCompare={() => routes.toPullRequestCompare({ spaceId, repoId })}
      onDeleteBranch={onDeleteBranch}
    />
  )
}
