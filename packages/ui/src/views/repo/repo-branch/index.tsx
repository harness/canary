import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button, NoData, NoSearchResults, PaginationComponent, SkeletonList, Spacer, Text } from '@/components'
// import { timeAgoFromISOTime } from '@/utils/time-utils'
import { SandboxLayout } from '@/views'

import { IBranchSelectorStore } from '../repo.types'
import { BranchesList } from './components/branch-list'
import { BranchStore } from './types'

// import CreateBranchDialog from './repo-branch-create'

// const sortOptions = [
//   { name: 'Date', value: 'date' },
//   { name: 'Name', value: 'name' }
// ]

interface RepoBranchListViewProps {
  repoId: string
  spaceId: string
  isLoading: boolean
  useRepoBranchesStore: () => IBranchSelectorStore
}
export const RepoBranchListView: React.FC<RepoBranchListViewProps> = ({
  isLoading,
  useRepoBranchesStore,
  xNextPage,
  xPrevPage,
  page,
  setPage,
  useTranslationStore,
  query
}) => {
  const { t } = useTranslationStore()

  const renderListContent = () => {
    const { repoId, spaceId, branchList, defaultBranch } = useRepoBranchesStore()
    if (isLoading && !branchList.length) return <SkeletonList />

    if (!branchList?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search', onClick: () => {} /*setQuery('')*/ }}
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
              //   setCreateBranchDialogOpen(true)
            }
          }}
        />
      )
    }

    //get the data arr from behindAhead
    // const behindAhead =
    //   branchDivergence?.map(divergence => {
    //     return {
    //       behind: divergence.behind,
    //       ahead: divergence.ahead
    //     }
    //   }) || []

    return <BranchesList defaultBranch={defaultBranch} repoId={repoId} spaceId={spaceId} branches={branchList} />
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
