import { FC, useMemo } from 'react'

import { Button, ListActions, PaginationComponent, SearchBox, Spacer } from '@/components'
import { SandboxLayout } from '@/views'
import { Filters, FiltersBar } from '@components/filters'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { getFilterOptions, getSortDirections, getSortOptions } from '@views/repo/constants/filter-options'
import { useFilters } from '@views/repo/hooks'

import { BranchesList } from './components/branch-list'
import { CreateBranchDialog } from './components/create-branch-dialog'
import { RepoBranchListViewProps } from './types'

export const RepoBranchListView: FC<RepoBranchListViewProps> = ({
  isLoading,
  useRepoBranchesStore,
  useTranslationStore,
  isCreateBranchDialogOpen,
  setCreateBranchDialogOpen,
  onSubmit,
  createBranchError,
  isCreatingBranch,
  searchQuery,
  setSearchQuery,
  toPullRequest,
  toBranchRules,
  toPullRequestCompare,
  onDeleteBranch,
  searchBranches,
  setCreateBranchSearchQuery
}) => {
  const { t } = useTranslationStore()
  const { branchList, defaultBranch, xNextPage, xPrevPage, page, setPage } = useRepoBranchesStore()

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)
  const filterHandlers = useFilters()

  const handleResetFiltersAndPages = () => {
    setPage(1)
    setSearchQuery(null)
    filterHandlers.handleResetFilters()
  }

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!filterHandlers.activeFilters.length || !!searchQuery
  }, [page, filterHandlers.activeFilters, searchQuery])

  return (
    <SandboxLayout.Main className="max-w-[1132px]">
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !branchList.length && !searchQuery })}>
        <Spacer size={2} />
        {(isLoading || !!branchList.length || isDirtyList) && (
          <>
            <span className="text-24 font-medium text-foreground-1">{t('views:repos.branches', 'Branches')}</span>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-80"
                  value={search || ''}
                  handleChange={handleSearchChange}
                  placeholder={t('views:repos.search', 'Search')}
                />
              </ListActions.Left>
              <ListActions.Right>
                <Filters
                  filterOptions={FILTER_OPTIONS}
                  sortOptions={SORT_OPTIONS}
                  filterHandlers={filterHandlers}
                  t={t}
                />
                <Button
                  variant="default"
                  onClick={() => {
                    setCreateBranchDialogOpen(true)
                  }}
                >
                  {t('views:repos.newBranch', 'New branch')}
                </Button>
              </ListActions.Right>
            </ListActions.Root>

            <FiltersBar
              filterOptions={FILTER_OPTIONS}
              sortOptions={SORT_OPTIONS}
              sortDirections={SORT_DIRECTIONS}
              filterHandlers={filterHandlers}
              t={t}
            />

            <Spacer size={5} />
          </>
        )}
        <BranchesList
          isLoading={isLoading}
          defaultBranch={defaultBranch}
          branches={branchList}
          useTranslationStore={useTranslationStore}
          setCreateBranchDialogOpen={setCreateBranchDialogOpen}
          handleResetFiltersAndPages={handleResetFiltersAndPages}
          toPullRequest={toPullRequest}
          toBranchRules={toBranchRules}
          toPullRequestCompare={toPullRequestCompare}
          onDeleteBranch={onDeleteBranch}
          isDirtyList={isDirtyList}
        />
        {!isLoading && (
          <PaginationComponent
            nextPage={xNextPage}
            previousPage={xPrevPage}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
            t={t}
          />
        )}
      </SandboxLayout.Content>
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => {
          setCreateBranchDialogOpen(false)
        }}
        onSubmit={onSubmit}
        branches={searchBranches}
        isLoadingBranches={isLoading}
        isCreatingBranch={isCreatingBranch}
        useTranslationStore={useTranslationStore}
        error={createBranchError}
        defaultBranch={defaultBranch}
        handleChangeSearchValue={setCreateBranchSearchQuery}
      />
    </SandboxLayout.Main>
  )
}
