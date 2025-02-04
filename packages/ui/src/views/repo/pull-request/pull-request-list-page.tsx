import { FC, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  ListActions,
  NoData,
  PaginationComponent,
  SearchBox,
  SkeletonList,
  Spacer,
  StackedList
} from '@/components'
import { useDebounceSearch } from '@/hooks'
import { PullRequestListStore, SandboxLayout, TranslationStore } from '@/views'
import FilterSelect, { FilterSelectLabel } from '@components/filters/filter-select'
import { noop } from 'lodash-es'

import { createFilters, FilterRefType, Parser } from '@harnessio/filters'

import ListControlBar from '../components/list-control-bar'
import { getPRListFilterOptions, getSortDirections, getSortOptions } from '../constants/filter-options'
import { useFilters } from '../hooks'
import { filterPullRequests } from '../utils/filtering/pulls'
import { sortPullRequests } from '../utils/sorting/pulls'
import { PullRequestList as PullRequestListContent } from './components/pull-request-list'

export interface PullRequestPageProps {
  usePullRequestListStore: () => PullRequestListStore
  repoId?: string
  spaceId?: string
  onFilterChange?: (filterValues: PRListFilters) => void
  useTranslationStore: () => TranslationStore
  isLoading?: boolean
  searchQuery?: string | null
  setSearchQuery: (query: string | null) => void
}

type PRListFilters = {
  created_by?: number
  created_lt?: Date
  created_gt?: Date
}

type PRListFiltersKeys = keyof PRListFilters

const PRListFilterHandler = createFilters<PRListFilters>()

const PullRequestList: FC<PullRequestPageProps> = ({
  usePullRequestListStore,
  spaceId,
  repoId,
  onFilterChange,
  useTranslationStore,
  isLoading,
  searchQuery,
  setSearchQuery
}) => {
  const { pullRequests, totalPages, page, setPage, openPullReqs, closedPullReqs } = usePullRequestListStore()
  const { t } = useTranslationStore()

  const PR_FILTER_OPTIONS = getPRListFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch: handleResetQuery
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()
  const [filterValues, setFilterValues] = useState<PRListFilters>({} as PRListFilters)
  const [openedFilter, setOpenedFilter] = useState<PRListFiltersKeys>()
  const filtersRef = useRef<FilterRefType<PRListFilters>>({} as FilterRefType<PRListFilters>)

  const filteredPullReqs = filterPullRequests(pullRequests, filterHandlers.activeFilters)
  const sortedPullReqs = sortPullRequests(filteredPullReqs, filterHandlers.activeSorts)
  const selectedFiltersCnt = Object.keys(filterValues).length

  const noData = !(sortedPullReqs && sortedPullReqs.length > 0)
  const handleCloseClick = () => {
    filterHandlers.handleResetFilters()
  }

  const handleOpenClick = () => {
    filterHandlers.handleResetFilters()
  }

  const showTopBar = !noData || selectedFiltersCnt > 0 || filterHandlers.activeSorts.length > 0 || !!searchQuery?.length

  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (noData) {
      return selectedFiltersCnt > 0 || searchQuery ? (
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
                onClick: handleResetQuery
              }}
              secondaryButton={{
                label: t('views:noData.clearFilters', 'Clear filters'),
                onClick: () => {
                  filterHandlers.handleResetFilters()
                  filtersRef.current?.reset()
                }
              }}
            />
          </div>
        </StackedList.Root>
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center py-20">
          <NoData
            iconName="no-data-folder"
            title="No pull requests yet"
            description={[
              t('views:noData.noPullRequests', 'There are no pull requests in this project yet.'),
              t('views:noData.createNewPullRequest', 'Create a new pull request.')
            ]}
            primaryButton={{
              label: 'Create pull request',
              to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
            }}
          />
        </div>
      )
    }

    return (
      <PullRequestListContent
        useTranslationStore={useTranslationStore}
        repoId={repoId}
        spaceId={spaceId}
        handleResetQuery={noop}
        pullRequests={sortedPullReqs}
        closedPRs={closedPullReqs}
        handleOpenClick={handleOpenClick}
        openPRs={openPullReqs}
        handleCloseClick={handleCloseClick}
      />
    )
  }

  const onFilterValueChange = (filterValues: PRListFilters) => {
    const _filterValues = Object.entries(filterValues).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key as PRListFiltersKeys] = value as number & Date
      }
      return acc
    }, {} as PRListFilters)

    onFilterChange?.(_filterValues)
    setFilterValues(_filterValues)
  }

  return (
    <PRListFilterHandler ref={filtersRef} onChange={onFilterValueChange} view="dropdown">
      <SandboxLayout.Main className="max-w-[1040px]">
        <SandboxLayout.Content>
          {showTopBar && (
            <>
              <Spacer size={2} />
              <p className="text-24 font-medium leading-snug tracking-tight text-foreground-1">Pull Requests</p>
              <Spacer size={6} />
              <ListActions.Root>
                <ListActions.Left>
                  <SearchBox.Root
                    width="full"
                    className="max-w-96"
                    value={searchInput || ''}
                    handleChange={handleInputChange}
                    placeholder={t('views:repos.search', 'Search')}
                  />
                </ListActions.Left>
                <ListActions.Right>
                  <PRListFilterHandler.Dropdown>
                    {(addFilter, availableFilters, resetFilters) => (
                      <FilterSelect
                        options={PR_FILTER_OPTIONS}
                        onChange={option => {
                          addFilter(option.value as PRListFiltersKeys)
                          setOpenedFilter(option.value as PRListFiltersKeys)
                        }}
                        onReset={resetFilters}
                        inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
                        buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
                        displayLabel={
                          <FilterSelectLabel
                            selectedFilters={PR_FILTER_OPTIONS.length - availableFilters.length}
                            displayLabel={t('component:filter.defaultLabel', 'Filter')}
                          />
                        }
                      />
                    )}
                  </PRListFilterHandler.Dropdown>
                  <Button variant="default" asChild>
                    <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>New pull request</Link>
                  </Button>
                </ListActions.Right>
              </ListActions.Root>
              <ListControlBar<PRListFilters>
                renderSelectedFilters={filterFieldRenderer => (
                  <PRListFilterHandler.Content className={'flex items-center gap-x-2'}>
                    {PR_FILTER_OPTIONS.map(filterOption => (
                      <PRListFilterHandler.Component
                        parser={filterOption.parser as unknown as Parser<PRListFilters[PRListFiltersKeys]>}
                        filterKey={filterOption.value as PRListFiltersKeys}
                        key={filterOption.value}
                      >
                        {({ onChange, removeFilter, value }) =>
                          filterFieldRenderer({ filterOption, onChange, removeFilter, value: value })
                        }
                      </PRListFilterHandler.Component>
                    ))}
                  </PRListFilterHandler.Content>
                )}
                renderFilterOptions={filterOptionsRenderer => (
                  <PRListFilterHandler.Dropdown>
                    {(addFilter, _availableFilters, resetFilters) => (
                      <div className="flex items-center gap-x-4">
                        {filterOptionsRenderer({ addFilter, resetFilters })}
                      </div>
                    )}
                  </PRListFilterHandler.Dropdown>
                )}
                openedFilter={openedFilter}
                setOpenedFilter={setOpenedFilter}
                selectedFiltersCnt={selectedFiltersCnt}
                filterOptions={PR_FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                sortDirections={SORT_DIRECTIONS}
                filterHandlers={filterHandlers}
                t={t}
              />
              <Spacer size={5} />
            </>
          )}
          {renderListContent()}
          <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </PRListFilterHandler>
  )
}
export { PullRequestList, PRListFilters }
