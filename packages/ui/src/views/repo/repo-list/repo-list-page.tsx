import { ChangeEvent, FC, ReactNode, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, ListActions, PaginationComponent, SearchBox, Spacer, Text } from '@/components'
import { Filters, FiltersBar } from '@components/filters'
import { debounce } from 'lodash-es'

import { SandboxLayout } from '../../index'
import { getFilterOptions, getLayoutOptions, getSortDirections, getSortOptions } from '../constants/filter-options'
import { useFilters, useViewManagement } from '../hooks'
import { filterRepositories } from '../utils/filtering/repos'
import { formatRepositories } from '../utils/formatting/repos'
import { sortRepositories } from '../utils/sorting/repos'
import { RepoList } from './repo-list'
import { RepoListProps } from './types'

const LinkComponent = ({ to, children }: { to: string; children: ReactNode }) => <Link to={to}>{children}</Link>

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

  const filteredRepos = filterRepositories(repositories, filterHandlers.activeFilters)
  const sortedRepos = sortRepositories(filteredRepos, filterHandlers.activeSorts)
  const reposWithFormattedDates = formatRepositories(sortedRepos)

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

  if (isError)
    return (
      <>
        <SandboxLayout.Main hasHeader hasLeftPanel>
          <SandboxLayout.Content>
            <Spacer size={2} />
            <Text size={1} className="text-destructive">
              {errorMessage || 'Something went wrong'}
            </Text>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </>
    )

  const noData = !(reposWithFormattedDates && reposWithFormattedDates.length > 0)
  const showTopBar = !noData || filterHandlers.activeFilters.length > 0 || searchQuery?.length

  return (
    <SandboxLayout.Main hasHeader hasLeftPanel>
      <SandboxLayout.Content>
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
                <Filters
                  filterOptions={FILTER_OPTIONS}
                  sortOptions={SORT_OPTIONS}
                  filterHandlers={filterHandlers}
                  viewManagement={viewManagement}
                  layoutOptions={LAYOUT_OPTIONS}
                  currentLayout={currentLayout}
                  onLayoutChange={setCurrentLayout}
                  t={t}
                />
                <Button variant="default" asChild>
                  <Link to={`create`}>{t('views:repos.create-repository')}</Link>
                </Button>
              </ListActions.Right>
            </ListActions.Root>
            {(filterHandlers.activeFilters.length > 0 || filterHandlers.activeSorts.length > 0) && <Spacer size={2} />}
            <FiltersBar
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
          LinkComponent={LinkComponent}
          handleResetFilters={filterHandlers.handleResetFilters}
          hasActiveFilters={filterHandlers.activeFilters.length > 0}
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
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxRepoListPage }
