import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button, PaginationComponent, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'

// import { SkeletonList } from '@harnessio/ui/components'
// import {
//   BranchesList,
// //   Filter,
//   NoData,
//   NoSearchResults,
//   PaginationComponent,
//   SandboxLayout,
//   useCommonFilter
// } from '@harnessio/'

import { BranchesList } from './components/branch-list'

// import CreateBranchDialog from './repo-branch-create'

const sortOptions = [
  { name: 'Date', value: 'date' },
  { name: 'Name', value: 'name' }
]

interface RepoBranchListViewProps {
  repoId: string
  spaceId: string
  isLoading: boolean
  // branches: any
}
export const RepoBranchListView: React.FC<RepoBranchListViewProps> = ({
  isLoading,
  repoId,
  spaceId,
  repoMetadata,
  branches,
  branchDivergence,
  xNextPage,
  xPrevPage,
  page,
  setPage,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()

  const renderListContent = () => {
    if (isLoading) return <SkeletonList />

    // if (!branches?.length) {
    //   if (query) {
    //     return (
    //   <NoSearchResults
    //     iconName="no-search-magnifying-glass"
    //     title="No search results"
    //     description={['Check your spelling and filter options,', 'or search for a different keyword.']}
    //     primaryButton={{ label: 'Clear search', onClick: () => setQuery('') }}
    //   />
    // )
    //   }
    //   return (
    // <NoData
    //   iconName="no-data-branches"
    //   title="No branches yet"
    //   description={[
    //     "Your branches will appear here once they're created.",
    //     'Start branching to see your work organized.'
    //   ]}
    //   primaryButton={{
    //     label: 'Create branch',
    //     onClick: () => {
    //       setCreateBranchDialogOpen(true)
    //     }
    //   }}
    // />
    //   )
    // }

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
        branches={branches?.map((branch, index) => {
          const { ahead: branchAhead, behind: branchBehind } = behindAhead[index] || {}
          return {
            id: index,
            name: branch.name || '',
            sha: branch.commit?.sha || '',
            // timestamp: branch.commit?.committer?.when ? timeAgoFromISOTime(branch.commit.committer.when) : '',
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
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Branches
        </Text>
        <Spacer size={6} />
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1">{/* <Filter sortOptions={sortOptions} /> */}</div>
          <Button
            variant="default"
            onClick={() => {
              //   setCreateBranchDialogOpen(true)
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
          t={t}
        />
      </SandboxLayout.Content>
      {/* <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => {
          setCreateBranchDialogOpen(false)
        }}
      /> */}
    </SandboxLayout.Main>
  )
}
