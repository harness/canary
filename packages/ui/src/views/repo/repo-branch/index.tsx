import { Button, NoData, PaginationComponent, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import { noop } from 'lodash-es'

import { BranchesList } from './components/branch-list'
import { RepoBranchListViewProps } from './types'

// import CreateBranchDialog from './repo-branch-create'

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
          <NoData
            iconName="no-search-magnifying-glass"
            title={t('views:noData.noResults', 'No search results')}
            description={[
              t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
              t('views:noData.changeSearch', 'or search for a different keyword.')
            ]}
            primaryButton={{
              label: t('views:noData.clearSearch', 'Clear search'),
              onClick: noop /*setQuery('')*/
            }}
          />
        )
      }
      return (
        <NoData
          iconName="no-data-branches"
          title={t('views:noData.noBranches', 'No branches yet')}
          description={[
            t('views:noData.createBranchDescription', "Your branches will appear here once they're created."),
            t('views:noData.startBranchDescription', 'Start branching to see your work organized.')
          ]}
          primaryButton={{
            label: t('views:noData.createBranch', 'Create branch'),
            onClick: () => {
              //   setCreateBranchDialogOpen(true)
              noop
            }
          }}
        />
      )
    }

    return (
      <BranchesList
        defaultBranch={defaultBranch}
        repoId={repoId}
        spaceId={spaceId}
        branches={branchList}
        useTranslationStore={useTranslationStore}
      />
    )
  }

  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          {t('views:repos.branches', 'Branches')}
        </Text>
        <Spacer size={6} />
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1">{/* <Filter sortOptions={sortOptions} /> */}</div>
          <Button
            variant="default"
            onClick={() => {
              //   setCreateBranchDialogOpen(true)
              noop
            }}
          >
            {t('views:repos.createBranch', 'Create branch')}
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
