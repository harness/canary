import { FC, useCallback, useMemo, useRef, useState } from 'react'

import {
  Button,
  ListActions,
  NoData,
  Pagination,
  SearchInput,
  SkeletonList,
  Spacer,
  StackedList,
  Text,
  ToggleGroup
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { renderFilterSelectLabel } from '@components/filters/filter-select'
import { CustomFilterOptionConfig, FilterFieldTypes, FilterOptionConfig } from '@components/filters/types'
import SearchableDropdown from '@components/searchable-dropdown/searchable-dropdown'

import { createFilters, FilterRefType } from '@harnessio/filters'

import ListControlBar from '../components/list-control-bar'
import { getPRListFilterOptions } from '../constants/filter-options'
import { filterLabelRenderer, getParserConfig, LabelsFilter, LabelsValue } from './components/labels'
import { PullRequestList as PullRequestListContent } from './components/pull-request-list'
import {
  PRFilterGroupTogglerOptions,
  PRListFilters,
  PULL_REQUEST_LIST_HEADER_FILTER_STATES,
  PullRequestPageProps
} from './pull-request.types'
import { getReviewOptions } from './utils'

type PRListFiltersKeys = keyof PRListFilters

const PRListFilterHandler = createFilters<PRListFilters>()

const PullRequestListPage: FC<PullRequestPageProps> = ({
  usePullRequestListStore,
  useLabelsStore,
  spaceId,
  repoId,
  onFilterChange,
  onFilterOpen,
  setPrincipalsSearchQuery,
  principalsSearchQuery,
  principalData,
  defaultSelectedAuthor,
  isPrincipalsLoading,
  isLoading,
  searchQuery,
  setSearchQuery,
  onLabelClick,
  toPullRequest
}) => {
  const { Link, useSearchParams } = useRouterContext()
  const { pullRequests, totalItems, pageSize, page, setPage, openPullReqs, closedPullReqs, setLabelsQuery } =
    usePullRequestListStore()

  const { t } = useTranslation()
  const [_searchParams, setSearchParams] = useSearchParams()
  const [activeFilterGrp, setActiveFilterGrp] = useState<PRFilterGroupTogglerOptions>(PRFilterGroupTogglerOptions.All)
  const { labels, values: labelValueOptions, isLoading: isLabelsLoading } = useLabelsStore()

  const [headerFilter, setHeaderFilter] = useState<PULL_REQUEST_LIST_HEADER_FILTER_STATES>(
    PULL_REQUEST_LIST_HEADER_FILTER_STATES.OPEN
  )

  const computedPrincipalData = useMemo(() => {
    return principalData || (defaultSelectedAuthor && !principalsSearchQuery ? [defaultSelectedAuthor] : [])
  }, [principalData, defaultSelectedAuthor, principalsSearchQuery])

  const labelsFilterConfig: CustomFilterOptionConfig<keyof PRListFilters, LabelsValue> = {
    label: t('views:repos.prListFilterOptions.labels.label', 'Label'),
    value: 'label_by',
    type: FilterFieldTypes.Custom,
    parser: getParserConfig(),
    filterFieldConfig: {
      renderCustomComponent: function ({ value, onChange }) {
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
    reviewOptions: getReviewOptions(),
    isPrincipalsLoading: isPrincipalsLoading,
    customFilterOptions: [labelsFilterConfig],
    principalData: computedPrincipalData.map(userInfo => ({
      label: userInfo?.display_name || '',
      value: String(userInfo?.id)
    }))
  })

  const handleInputChange = useCallback(
    (val: string) => {
      setSearchQuery(val.length ? val : null)
    },
    [setSearchQuery]
  )

  const handleResetQuery = () => {
    setSearchQuery('')
  }

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

  const showTopBar = !noData || selectedFiltersCnt > 0 || !!searchQuery?.length

  const renderListContent = () => {
    if (isLoading) {
      return <SkeletonList />
    }

    if (noData) {
      return selectedFiltersCnt > 0 || searchQuery ? (
        <StackedList.Root className="grow place-content-center">
          <NoData
            imageName="no-search-magnifying-glass"
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
          imageName="no-data-folder"
          title="No pull requests yet"
          description={
            repoId
              ? [
                  t('views:noData.noPullRequestsInRepo', `There are no pull requests in this repo yet.`),
                  t('views:noData.createNewPullRequest', 'Create a new pull request.')
                ]
              : [t('views:noData.noPullRequestsInProject', `There are no pull requests in this project yet.`)]
          }
          primaryButton={
            repoId
              ? {
                  label: 'Create pull request',
                  to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
                }
              : undefined
          }
        />
      )
    }

    return (
      <PullRequestListContent
        repoId={repoId}
        spaceId={spaceId}
        pullRequests={pullRequests}
        closedPRs={closedPullReqs}
        openPRs={openPullReqs}
        headerFilter={headerFilter}
        setHeaderFilter={setHeaderFilter}
        toPullRequest={toPullRequest}
        onLabelClick={onLabelClick}
      />
    )
  }

  const onFilterGroupChange = (filterGroup: string) => {
    if (filterGroup === PRFilterGroupTogglerOptions.All) {
      setSearchParams(prev => {
        prev.delete('created_by')
        return prev
      })
    }

    if (filterGroup === PRFilterGroupTogglerOptions.Created) {
      setSearchParams(prev => {
        if (prev.has('created_by')) {
          prev.delete('created_by')
        }
        // Update with proper userId
        prev.append('created_by', '3335')
        return prev
      })
    }

    setActiveFilterGrp(filterGroup as PRFilterGroupTogglerOptions)
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
            <Text as="h1" variant="heading-section" color="foreground-1" className="mb-6">
              Pull Requests
            </Text>

            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  size="sm"
                  defaultValue={searchQuery || ''}
                  placeholder={t('views:repos.search', 'Search')}
                  inputContainerClassName="max-w-96"
                  onChange={handleInputChange}
                />
              </ListActions.Left>
              <ListActions.Right>
                <ToggleGroup.Root type="single" value={activeFilterGrp} onChange={onFilterGroupChange} unselectable>
                  <ToggleGroup.Item value={PRFilterGroupTogglerOptions.All} text="All" />
                  <ToggleGroup.Item value={PRFilterGroupTogglerOptions.Created} text="Created" />
                  <ToggleGroup.Item value={PRFilterGroupTogglerOptions.ReviewRequested} text="Review Requested" />
                </ToggleGroup.Root>

                <PRListFilterHandler.Dropdown>
                  {(addFilter, availableFilters, resetFilters) => (
                    <SearchableDropdown<FilterOptionConfig<PRListFiltersKeys, LabelsValue>>
                      options={PR_FILTER_OPTIONS.filter(option => availableFilters.includes(option.value))}
                      onChange={option => {
                        addFilter(option.value)
                        setOpenedFilter(option.value)
                      }}
                      onReset={() => resetFilters()}
                      inputPlaceholder={t('component:filter.inputPlaceholder', 'Filter by...')}
                      buttonLabel={t('component:filter.buttonLabel', 'Reset filters')}
                      displayLabel={renderFilterSelectLabel({
                        selectedFilters: PR_FILTER_OPTIONS.length - availableFilters.length,
                        displayLabel: t('component:filter.defaultLabel', 'Filter')
                      })}
                    />
                  )}
                </PRListFilterHandler.Dropdown>
                {/**
                 * Creating a pull request is permitted only when inside a repository.
                 */}
                {repoId ? (
                  <Button asChild>
                    <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>New pull request</Link>
                  </Button>
                ) : null}
              </ListActions.Right>
            </ListActions.Root>
            <ListControlBar<PRListFilters, LabelsValue, PRListFilters[PRListFiltersKeys]>
              renderSelectedFilters={filterFieldRenderer => (
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
              )}
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
            />
            <Spacer size={5} />
          </PRListFilterHandler>
        )}
        {renderListContent()}
        <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestListPage }
