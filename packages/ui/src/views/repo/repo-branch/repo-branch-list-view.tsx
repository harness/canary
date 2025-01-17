import { ChangeEvent, useCallback, useState } from 'react'

import { Button, ListActions, PaginationComponent, SearchBox, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import { Filters, FiltersBar } from '@components/filters'
import { cn } from '@utils/cn'
import { getFilterOptions, getSortDirections, getSortOptions } from '@views/repo/constants/filter-options'
import { useFilters } from '@views/repo/hooks'
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

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)
  const filterHandlers = useFilters()

  const handleResetFiltersAndPages = () => {
    setPage(1)
    setSearchInput('')
    setSearchQuery(null)
    filterHandlers.handleResetFilters()
  }

  return (
    <SandboxLayout.Main className="max-w-[1132px]">
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !branchList.length && !searchQuery })}>
        <Spacer size={2} />
        {(isLoading || !!branchList.length || searchQuery) && (
          <>
            <Text size={5} weight={'medium'}>
              {t('views:repos.branches', 'Branches')}
            </Text>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-80"
                  value={searchInput || ''}
                  handleChange={handleInputChange}
                  placeholder={t('views:repos.search')}
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
          repoId={repoId}
          spaceId={spaceId}
          branches={branchList}
          useTranslationStore={useTranslationStore}
          searchQuery={searchQuery}
          setCreateBranchDialogOpen={setCreateBranchDialogOpen}
          handleResetFiltersAndPages={handleResetFiltersAndPages}
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
