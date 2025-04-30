import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import { Button, ListActions, NoData, Pagination, SearchBox, SkeletonList, Spacer, StackedList } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'
import FilterSelect, { FilterSelectLabel } from '@components/filters/filter-select'
import { CustomFilterOptionConfig, FilterFieldTypes } from '@components/filters/types'

import { createFilters, FilterRefType } from '@harnessio/filters'

import ListControlBar from '../components/list-control-bar'
import { getPRListFilterOptions } from '../constants/filter-options'
import { filterLabelRenderer, getParserConfig, LabelsFilter, LabelsValue } from './components/labels'
import { PullRequestList as PullRequestListContent } from './components/pull-request-list'
import type { PRListFilters, PullRequestPageProps } from './pull-request.types'

type PRListFiltersKeys = keyof PRListFilters

const PRListFilterHandler = createFilters<PRListFilters>()

const PullRequestListPage: FC<PullRequestPageProps> = ({
  usePullRequestListStore,
  useLabelsStore,
  spaceId,
  repoId,
  onFilterChange,
  onFilterOpen,
  defaultSelectedAuthorError,
  setPrincipalsSearchQuery,
  principalsSearchQuery,
  useTranslationStore,
  principalData,
  defaultSelectedAuthor,
  isPrincipalsLoading,
  isLoading,
  searchQuery,
  setSearchQuery
}) => {
  const { Link, useSearchParams } = useRouterContext()
  const { pullRequests, totalPages, page, setPage, openPullReqs, closedPullReqs, setLabelsQuery } =
    usePullRequestListStore()

  const { t } = useTranslationStore()
  const [searchParams] = useSearchParams()
  const { labels, values: labelValueOptions, isLoading: isLabelsLoading } = useLabelsStore()

  const computedPrincipalData = useMemo(() => {
    return principalData || (defaultSelectedAuthor && !principalsSearchQuery ? [defaultSelectedAuthor] : [])
  }, [principalData, defaultSelectedAuthor, principalsSearchQuery])

  const [isAllFilterDataPresent, setisAllFilterDataPresent] = useState<boolean>(true)

  const labelsFilterConfig: CustomFilterOptionConfig<keyof PRListFilters, LabelsValue> = {
    label: t('views:repos.prListFilterOptions.labels.label', 'Label'),
    value: 'label_by',
    type: FilterFieldTypes.Custom,
    parser: getParserConfig(),
    filterFieldConfig: {
      renderCustomComponent: function ({ value, onChange }): ReactNode {
        return (
          <LabelsFilter
            isLabelsLoading={isLabelsLoading}
            onInputChange={setLabelsQuery}
            valueOptions={labelValueOptions}
            labelOptions={labels}
            onChange={onChange}
            value={value}
          />
        )
      },
      renderFilterLabel: (value?: LabelsValue) =>
        filterLabelRenderer({
          selectedValue: value,
          labelOptions: labels,
          valueOptions: labelValueOptions
        })
    }
  }

  const PR_FILTER_OPTIONS = getPRListFilterOptions({
    t,
    onAuthorSearch: searchText => {
      setPrincipalsSearchQuery?.(searchText)
    },
    isPrincipalsLoading: isPrincipalsLoading,
    customFilterOptions: [labelsFilterConfig],
    principalData:
      computedPrincipalData?.map(userInfo => ({
        label: userInfo?.display_name || '',
        value: String(userInfo?.id)
      })) ?? []
  })

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
  const [openedFilter, setOpenedFilter] = useState<PRListFiltersKeys>()
  const filtersRef = useRef<FilterRefType<PRListFilters> | null>(null)

  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)

  const noData = !(pullRequests && pullRequests.length > 0)

  const onFilterSelectionChange = (filterValues: PRListFiltersKeys[]) => {
    setSelectedFiltersCnt(filterValues.length)
  }

  useEffect(() => {
    setisAllFilterDataPresent(
      searchParams.get('created_by') && !defaultSelectedAuthorError ? !!defaultSelectedAuthor : true
    )
  }, [defaultSelectedAuthor, defaultSelectedAuthorError])

  const showTopBar = !noData || selectedFiltersCnt > 0 || !!searchQuery?.length

  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (noData) {
      return selectedFiltersCnt > 0 || searchQuery ? (
        <StackedList.Root className="grow place-content-center">
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
                filtersRef.current?.reset()
              }
            }}
          />
        </StackedList.Root>
      ) : (
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
      )
    }

    return (
      <PullRequestListContent
        useTranslationStore={useTranslationStore}
        repoId={repoId}
        spaceId={spaceId}
        pullRequests={pullRequests}
        closedPRs={closedPullReqs}
        openPRs={openPullReqs}
      />
    )
  }

  const handleFilterOpen = (filterValues: PRListFiltersKeys, isOpen: boolean) => {
    if (filterValues === 'created_by' && isOpen) {
      // Reset search query so that new principal data set would be fetched
      // when the filter is opened
      setPrincipalsSearchQuery?.('')
    }

    if (isOpen) {
      onFilterOpen?.(filterValues)
    }
  }

  const onFilterValueChange = (filterValues: PRListFilters) => {
    const _filterValues = Object.entries(filterValues).reduce(
      (acc: Record<string, PRListFilters[keyof PRListFilters]>, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value
        }
        return acc
      },
      {}
    )

    onFilterChange?.(_filterValues)
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        {showTopBar && (
          <PRListFilterHandler
            ref={filtersRef}
            onFilterSelectionChange={onFilterSelectionChange}
            onChange={onFilterValueChange}
            view="dropdown"
          >
            <h1 className="mb-6 text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">Pull Requests</h1>

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
                    <FilterSelect<PRListFiltersKeys, LabelsValue>
                      options={PR_FILTER_OPTIONS.filter(option => availableFilters.includes(option.value))}
                      onChange={option => {
                        addFilter(option.value)
                        setOpenedFilter(option.value)
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
                <Button asChild>
                  <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>New pull request</Link>
                </Button>
              </ListActions.Right>
            </ListActions.Root>
            <ListControlBar<PRListFilters, LabelsValue, PRListFilters[PRListFiltersKeys]>
              renderSelectedFilters={filterFieldRenderer =>
                isAllFilterDataPresent && (
                  <PRListFilterHandler.Content className={'flex items-center gap-x-2'}>
                    {PR_FILTER_OPTIONS.map(filterOption => {
                      return (
                        <PRListFilterHandler.Component
                          parser={filterOption.parser}
                          filterKey={filterOption.value}
                          key={filterOption.value}
                        >
                          {({ onChange, removeFilter, value }) =>
                            filterFieldRenderer({
                              filterOption,
                              onChange,
                              removeFilter,
                              value: value,
                              onOpenChange: isOpen => {
                                handleFilterOpen(filterOption.value, isOpen)
                              }
                            })
                          }
                        </PRListFilterHandler.Component>
                      )
                    })}
                  </PRListFilterHandler.Content>
                )
              }
              renderFilterOptions={filterOptionsRenderer => (
                <PRListFilterHandler.Dropdown>
                  {(addFilter, availableFilters, resetFilters) => (
                    <div className="flex items-center gap-x-4">
                      {filterOptionsRenderer({ addFilter, resetFilters, availableFilters })}
                    </div>
                  )}
                </PRListFilterHandler.Dropdown>
              )}
              openedFilter={openedFilter}
              setOpenedFilter={setOpenedFilter}
              selectedFiltersCnt={selectedFiltersCnt}
              filterOptions={PR_FILTER_OPTIONS}
              t={t}
            />
            <Spacer size={5} />
          </PRListFilterHandler>
        )}
        {renderListContent()}
        <Pagination totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestListPage }
