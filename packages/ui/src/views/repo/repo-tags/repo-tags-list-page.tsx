import { FC, useMemo } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, SkeletonTable, Spacer, StackedList } from '@/components'
import { RepoTagsStore, SandboxLayout, TranslationStore } from '@/views'
import { Filters, FiltersBar } from '@components/filters'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { getFilterOptions, getSortDirections, getSortOptions } from '@views/repo/constants/filter-options'
import { useFilters } from '@views/repo/hooks'

import { RepoTagsList } from './components/repo-tags-list'

interface RepoTagsListViewProps {
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  openCreateBranchDialog: () => void
  searchQuery: string
  setSearchQuery: (value: string | null) => void
  onDeleteTag: (tagName: string) => void
  useRepoTagsStore: () => RepoTagsStore
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export const RepoTagsListView: FC<RepoTagsListViewProps> = ({
  useTranslationStore,
  isLoading,
  openCreateBranchDialog,
  searchQuery,
  setSearchQuery,
  onDeleteTag,
  useRepoTagsStore,
  toCommitDetails
}) => {
  const { t } = useTranslationStore()
  const { tags: tagsList, page, xNextPage, xPrevPage, setPage } = useRepoTagsStore()
  const noData = !(tagsList && tagsList.length > 0)

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

  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonTable countRows={10} countColumns={4} />
    } else if (noData) {
      return filterHandlers.activeFilters.length > 0 || searchQuery ? (
        <StackedList.Root>
          <div className="flex min-h-[50vh] items-center justify-center py-20">
            <NoData
              iconName="no-search-magnifying-glass"
              title={t('views:noData.noResults', 'No search results')}
              description={[
                t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
                t('views:noData.changeSearch', 'or search for a different keyword.')
              ]}
              primaryButton={{
                label: t('views:noData.clearSearch', 'Clear search'),
                onClick: handleResetFiltersAndPages
              }}
              secondaryButton={{
                label: t('views:noData.clearFilters', 'Clear filters'),
                onClick: filterHandlers.handleResetFilters
              }}
            />
          </div>
        </StackedList.Root>
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center py-20">
          <NoData
            iconName="no-data-tags"
            title="No tags yet"
            description={[
              t('views:noData.noTags', 'There are no tags in this project yet.'),
              t('views:noData.createNewTag', 'Create a new Tag.')
            ]}
            primaryButton={{
              label: 'Create tag',
              onClick: openCreateBranchDialog
            }}
          />
        </div>
      )
    }
    return (
      <RepoTagsList
        isLoading={isLoading}
        onDeleteTag={onDeleteTag}
        useTranslationStore={useTranslationStore}
        useRepoTagsStore={useRepoTagsStore}
        toCommitDetails={toCommitDetails}
      />
    )
  }

  return (
    <SandboxLayout.Main className="max-w-[1132px]">
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !tagsList.length && !searchQuery })}>
        <Spacer size={2} />
        {(isLoading || !!tagsList.length || isDirtyList) && (
          <>
            <span className="text-24 font-medium text-foreground-1">{t('views:repos.tags', 'Tags')}</span>
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
                <Button variant="default" onClick={openCreateBranchDialog}>
                  {t('views:repos.newTag', 'New tag')}
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
        {renderListContent()}

        <Spacer size={5} />
        <Pagination currentPage={page} nextPage={xNextPage} previousPage={xPrevPage} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
