import { ChangeEvent, FC, useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button, ButtonGroup, ListActions, NoData, PaginationComponent, SearchBox, Spacer, Text } from '@/components'
import { Filters, FiltersBar, FilterValue } from '@components/filters'
import { debounce } from 'lodash-es'

import { createFilters } from '@harnessio/filters'

import { SandboxLayout } from '../../index'
import { getFilterOptions, getLayoutOptions, getSortDirections, getSortOptions } from '../constants/filter-options'
import { useFilters, useViewManagement } from '../hooks'
import { filterRepositories } from '../utils/filtering/repos'
import { formatRepositories } from '../utils/formatting/repos'
import { sortRepositories } from '../utils/sorting/repos'
import { RepoList } from './repo-list'
import { filterRef, RepoListFilters, RepoListProps } from './types'

const DEFAULT_ERROR_MESSAGE = ['An error occurred while loading the data. ', 'Please try again and reload the page.']

export const RepoFilter = createFilters<RepoListFilters>()

const SandboxRepoListPage: FC<RepoListProps> = ({
  useRepoStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslationStore()
  const navigate = useNavigate()
  const filterRef = useRef<filterRef>(null)

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)
  const LAYOUT_OPTIONS = getLayoutOptions(t)

  const [searchInput, setSearchInput] = useState(searchQuery)

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, totalPages, page, setPage } = useRepoStore()

  const [currentLayout, setCurrentLayout] = useState(LAYOUT_OPTIONS[1].value)

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()
  const viewManagement = useViewManagement({
    storageKey: 'sandbox-repo-filters',
    setActiveFilters: filterHandlers.setActiveFilters,
    setActiveSorts: filterHandlers.setActiveSorts
  })

  const [filterValues, setFilterValues] = useState<FilterValue<RepoListFilters>[]>([])
  const filteredRepos = filterRepositories(repositories, filterValues)
  const sortedRepos = sortRepositories(filteredRepos, filterHandlers.activeSorts)
  const reposWithFormattedDates = formatRepositories(sortedRepos)
  const [openedFilter, setOpenedFilter] = useState<keyof RepoListFilters>()

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const onFilterValueChange = useCallback(
    (filterValues: { key: keyof RepoListFilters; value: RepoListFilters[keyof RepoListFilters] }[]) => {
      setFilterValues(
        filterValues
          .map(({ key, value }) => ({ type: key, selectedValues: value }))
          .filter(({ selectedValues }) => !!selectedValues)
      )
    },
    []
  )

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

  if (isError)
    return (
      <>
        <SandboxLayout.Main>
          <SandboxLayout.Content>
            <div className="flex min-h-[70vh] items-center justify-center py-20">
              <NoData
                iconName="no-data-error"
                title="Failed to load repositories"
                description={errorMessage ? [errorMessage] : DEFAULT_ERROR_MESSAGE}
                primaryButton={{
                  label: 'Reload',
                  onClick: () => {
                    navigate(0) // Reload the page
                  }
                }}
              />
            </div>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </>
    )

  const selectedFiltersCnt = filterValues.length
  const noData = !(reposWithFormattedDates && reposWithFormattedDates.length > 0)
  const showTopBar = !noData || selectedFiltersCnt > 0 || searchQuery?.length

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <RepoFilter onChange={onFilterValueChange} ref={filterRef as any} view="dropdown">
          {/* 
          TODO: Replace the Text component with a Title component in the future.
          Consider using a Title component that supports a prefix prop for displaying the selected saved filter name.
          Example:
          <Title prefix={filterHandlers.currentView?.name}>
            {t('views:repos.repositories')}
          </Title>
        */}
          {showTopBar ? (
            <>
              <Spacer size={10} />
              <div className="flex items-end">
                <Text className="leading-none" size={5} weight={'medium'}>
                  {t('views:repos.repositories')}
                </Text>
                {viewManagement.currentView && (
                  <>
                    <span className="mx-2.5 inline-flex h-[18px] w-px bg-borders-1" />
                    <span className="text-14 text-foreground-3">{viewManagement.currentView.name}</span>
                  </>
                )}
              </div>
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
                  <Filters<RepoListFilters>
                    setOpenedFilter={setOpenedFilter}
                    filterOptions={FILTER_OPTIONS}
                    sortOptions={SORT_OPTIONS}
                    filterHandlers={filterHandlers}
                    viewManagement={viewManagement}
                    layoutOptions={LAYOUT_OPTIONS}
                    currentLayout={currentLayout}
                    onLayoutChange={setCurrentLayout}
                    t={t}
                  />
                  <ButtonGroup>
                    <Button variant="default" asChild>
                      <Link to={`create`}>{t('views:repos.create-repository')}</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`import`}>{t('views:repos.import-repository', 'Import repository')}</Link>
                    </Button>
                  </ButtonGroup>
                </ListActions.Right>
              </ListActions.Root>
              {(selectedFiltersCnt > 0 || filterHandlers.activeSorts.length > 0) && <Spacer size={2} />}
              <FiltersBar<RepoListFilters>
                openedFilter={openedFilter}
                setOpenedFilter={setOpenedFilter}
                selectedFiltersCnt={selectedFiltersCnt}
                filterOptions={FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                sortDirections={SORT_DIRECTIONS}
                filterHandlers={filterHandlers}
                viewManagement={viewManagement}
                t={t}
              />
            </>
          ) : null}
          <Spacer size={5} />
          <RepoList
            repos={reposWithFormattedDates}
            handleResetFilters={() => {
              filterHandlers.handleResetFilters()
              filterRef.current?.reset?.()
            }}
            hasActiveFilters={selectedFiltersCnt > 0}
            query={searchQuery ?? ''}
            handleResetQuery={() => {
              setSearchInput('')
              setSearchQuery(null)
            }}
            useTranslationStore={useTranslationStore}
            isLoading={isLoading}
          />
          <Spacer size={8} />
          <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={page => setPage(page)} t={t} />
        </RepoFilter>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxRepoListPage }
