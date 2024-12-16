import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'

import { Button, Spacer, Text } from '@harnessio/canary'
import {
  ListBranchesQueryQueryParams,
  TypesBranchExtended,
  useCalculateCommitDivergenceMutation,
  useFindRepositoryQuery,
  useListBranchesQuery
} from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  BranchesList,
  Filter,
  NoData,
  NoSearchResults,
  PaginationComponent,
  SandboxLayout,
  useCommonFilter
} from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { PathParams } from '../../RouteDefinitions'
import { orderSortDate, PageResponseHeader } from '../../types'
import { timeAgoFromISOTime } from '../pipeline-edit/utils/time-utils'
import CreateBranchDialog from './repo-branch-create'

const sortOptions = [
  { name: 'Date', value: 'date' },
  { name: 'Name', value: 'name' }
]

export function RepoBranchesListPage() {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { sort } = useCommonFilter<ListBranchesQueryQueryParams['sort']>()
  const [query, setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { isLoading, data: { body: branches, headers } = {} } = useListBranchesQuery({
    queryParams: { page, sort, query, order: orderSortDate.DESC, include_commit: true },
    repo_ref: repoRef
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

  const { data: { body: branchDivergence = [] } = {}, mutate } = useCalculateCommitDivergenceMutation({
    repo_ref: repoRef
  })

  useEffect(() => {
    if (branches?.length !== 0 && branches !== undefined) {
      mutate({
        body: {
          requests: branches?.map(branch => ({ from: branch.name, to: repoMetadata?.default_branch })) || []
        }
      })
    }
  }, [mutate, branches, repoMetadata?.default_branch])

  const renderListContent = () => {
    if (isLoading) return <SkeletonList />

    if (!branches?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search', onClick: () => setQuery('') }}
          />
        )
      }
      return (
        <NoData
          iconName="no-data-branches"
          title="No branches yet"
          description={[
            "Your branches will appear here once they're created.",
            'Start branching to see your work organized.'
          ]}
          primaryButton={{
            label: 'Create branch',
            onClick: () => {
              setCreateBranchDialogOpen(true)
            }
          }}
        />
      )
    }

    //get the data arr from behindAhead
    const behindAhead =
      branchDivergence?.map(divergence => {
        return {
          behind: divergence.behind,
          ahead: divergence.ahead
        }
      }) || []

    return (
      <BranchesList
        defaultBranch={repoMetadata?.default_branch}
        repoId={repoId}
        spaceId={spaceId}
        branches={branches?.map((branch: TypesBranchExtended, index) => {
          const { ahead: branchAhead, behind: branchBehind } = behindAhead[index] || {}
          return {
            id: index,
            name: branch.name || '',
            sha: branch.commit?.sha || '',
            timestamp: branch.commit?.committer?.when ? timeAgoFromISOTime(branch.commit.committer.when) : '',
            user: {
              name: branch.commit?.committer?.identity?.name || '',
              avatarUrl: ''
            },
            behindAhead: {
              behind: branchBehind || 0,
              ahead: branchAhead || 0,
              default: repoMetadata?.default_branch === branch.name
            }
          }
        })}
      />
    )
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Branches
        </Text>
        <Spacer size={6} />
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1">
            <Filter sortOptions={sortOptions} />
          </div>
          <Button
            variant="default"
            onClick={() => {
              setCreateBranchDialogOpen(true)
            }}
          >
            Create branch
          </Button>
        </div>
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        <PaginationComponent
          nextPage={xNextPage}
          previousPage={xPrevPage}
          currentPage={page}
          goToPage={(pageNum: number) => setPage(pageNum)}
        />
      </SandboxLayout.Content>
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => {
          setCreateBranchDialogOpen(false)
        }}
      />
    </SandboxLayout.Main>
  )
}
