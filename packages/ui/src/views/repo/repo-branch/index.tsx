import { ChangeEvent, useCallback, useState } from 'react'

import { Button, ListActions, NoData, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import { debounce } from 'lodash-es'

import { BranchesList } from './components/branch-list'
import { CreateBranchDialog } from './components/create-branch-dialog'
import { RepoBranchListViewProps } from './types'

export const RepoBranchListView: React.FC<RepoBranchListViewProps> = ({
  isLoading,
  useRepoBranchesStore,
  useTranslationStore,
  isCreateBranchDialogOpen,
  setCreateBranchDialogOpen,
  onSubmit,
  createBranchError,
  isCreatingBranch,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslationStore()
  const { repoId, spaceId, branchList, defaultBranch, xNextPage, xPrevPage, page, setPage } = useRepoBranchesStore()
  const [searchInput, setSearchInput] = useState(searchQuery)

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

  const renderListContent = () => {
    if (isLoading && !branchList.length) return <SkeletonList />

    if (!branchList?.length) {
      if (searchQuery) {
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
              onClick: () => {
                setSearchInput('')
                setSearchQuery(null)
              }
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
              setCreateBranchDialogOpen(true)
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
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          {t('views:repos.branches', 'Branches')}
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-96"
              value={searchInput || ''}
              handleChange={handleInputChange}
              placeholder={t('views:repos.search')}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Button
              variant="default"
              onClick={() => {
                setCreateBranchDialogOpen(true)
              }}
            >
              {t('views:repos.createBranch', 'Create branch')}
            </Button>
          </ListActions.Right>
        </ListActions.Root>

        <Spacer size={5} />
        {renderListContent()}
        <PaginationComponent
          nextPage={xNextPage}
          previousPage={xPrevPage}
          currentPage={page}
          goToPage={(pageNum: number) => setPage(pageNum)}
          t={t}
        />
      </SandboxLayout.Content>
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => {
          setCreateBranchDialogOpen(false)
        }}
        onSubmit={onSubmit}
        branches={branchList}
        isLoadingBranches={isLoading}
        isCreatingBranch={isCreatingBranch}
        useTranslationStore={useTranslationStore}
        error={createBranchError}
        defaultBranch={defaultBranch}
      />
    </SandboxLayout.Main>
  )
}
