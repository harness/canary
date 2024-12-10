import { Button, NoData, NoSearchResults, PaginationComponent, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

import { IBranchSelectorStore } from '../repo.types'
import { BranchesList } from './components/branch-list'

// import CreateBranchDialog from './repo-branch-create'

interface RepoBranchListViewProps {
  isLoading: boolean
  useRepoBranchesStore: () => IBranchSelectorStore
  useTranslationStore: () => TranslationStore
  query: string
}
export const RepoBranchListView: React.FC<RepoBranchListViewProps> = ({
  isLoading,
  useRepoBranchesStore,
  useTranslationStore,
  query
}) => {
  const { t } = useTranslationStore()
  const { repoId, spaceId, branchList, defaultBranch, xNextPage, xPrevPage, page, setPage } = useRepoBranchesStore()
  const renderListContent = () => {
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
