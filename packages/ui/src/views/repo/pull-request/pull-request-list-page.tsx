import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  Button,
  ButtonGroup,
  ButtonGroupBaseButtonProps,
  IconV2,
  Layout,
  ListActions,
  NoData,
  Pagination,
  SearchInput,
  Skeleton,
  Spacer,
  StackedList,
  Text
} from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import { ExtendedScope, SandboxLayout } from '@/views'
import { renderFilterSelectLabel } from '@components/filters/filter-select'
import {
  CheckboxOptions,
  CustomFilterOptionConfig,
  FilterFieldTypes,
  FilterOptionConfig,
  MultiSelectFilterOptionConfig
} from '@components/filters/types'
import SearchableDropdown from '@components/searchable-dropdown/searchable-dropdown'
import { splitObjectProps } from '@utils/typeUtils'
import { isEmpty } from 'lodash-es'

import { createFilters, FilterRefType } from '@harnessio/filters'

import BranchCompareBannerList from '../components/branch-banner/branch-compare-banner-list'
import ListControlBar from '../components/list-control-bar'
import { getPRListFilterOptions } from '../constants/filter-options'
import { filterLabelRenderer, getParserConfig, LabelsFilter, LabelsValue } from './components/labels'
import { PullRequestList as PullRequestListContent } from './components/pull-request-list'
import { PRFilterGroupTogglerOptions, PRListFilters, PullRequestPageProps } from './pull-request.types'
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
  prCandidateBranches,
  principalsSearchQuery,
  principalData,
  defaultSelectedAuthor,
  currentUser,
  isPrincipalsLoading,
  isLoading,
  repository,
  searchQuery,
  setSearchQuery,
  onLabelClick,
  scope,
  defaultSelectedAuthorError: _,
  ...routingProps
}) => {
  const [showScope, setShowScope] = useState(false)
  const { Link, useSearchParams, location } = useRouterContext()
  const isProjectLevel = !repoId
  const {
    pullRequests,
    totalItems,
    pageSize,
    page,
    setPage,
    openPullReqs,
    mergedPullReqs,
    closedPullReqs,
    setLabelsQuery,
    setPrState,
    prState
  } = usePullRequestListStore()

  const { t } = useTranslation()
  const [_searchParams, setSearchParams] = useSearchParams()
  const [activeFilterGrp, setActiveFilterGrp] = useState<PRFilterGroupTogglerOptions>(PRFilterGroupTogglerOptions.All)
  const { labels, values: labelValueOptions, isLoading: isLabelsLoading } = useLabelsStore()

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const [openedFilter, setOpenedFilter] = useState<PRListFiltersKeys>()
  const filtersRef = useRef<FilterRefType<PRListFilters> | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const currentUserId = currentUser?.id

  useEffect(() => {
    if (!isProjectLevel) {
      return
    }

    const currentParams = new URLSearchParams(window.location.search)
    if (currentParams.has('created_by') && currentParams.get('created_by') === String(currentUserId)) {
      if (currentParams.has('review_decision')) {
        setActiveFilterGrp(PRFilterGroupTogglerOptions.ReviewRequested)
      } else {
        setActiveFilterGrp(PRFilterGroupTogglerOptions.Created)
      }
    } else if (currentParams.has('review_decision')) {
      setActiveFilterGrp(PRFilterGroupTogglerOptions.ReviewRequested)
    } else {
      setActiveFilterGrp(PRFilterGroupTogglerOptions.All)
    }
  }, [currentUserId, location.search, isProjectLevel])

  const computedPrincipalData = useMemo(() => {
    return principalData || (defaultSelectedAuthor && !principalsSearchQuery ? [defaultSelectedAuthor] : [])
  }, [principalData, defaultSelectedAuthor, principalsSearchQuery])

  const generateAuthorLabel = ({
    display_name,
    email
  }: Pick<PrincipalType, 'display_name' | 'email'>): React.ReactNode =>
    display_name !== email ? (
      <Layout.Flex align="center" className="gap-x-1">
        <Text wrap="nowrap">{display_name}</Text>
        <Text color="foreground-4" variant="body-single-line-normal" lineClamp={1}>
          ({email})
        </Text>
      </Layout.Flex>
    ) : (
      <Text lineClamp={1}>{display_name}</Text>
    )

  const userSelectOptions = useMemo(() => {
    const allUsersOptions = computedPrincipalData.map(user => ({
      label: generateAuthorLabel(user),
      value: String(user?.id)
    }))

    let otherUserOptions = allUsersOptions

    // is searchQuery is empty, move currentUser to start of list
    if (currentUser?.id && !principalsSearchQuery) {
      otherUserOptions = allUsersOptions.filter(user => user?.value !== String(currentUser?.id))
      const currentUserOption = {
        label: generateAuthorLabel(currentUser),
        value: String(currentUser.id)
      }
      return [currentUserOption, ...otherUserOptions]
    }

    // if searchQuery is present, return all users
    return allUsersOptions
  }, [computedPrincipalData, currentUser, principalsSearchQuery])

  const labelsFilterConfig: CustomFilterOptionConfig<keyof PRListFilters, LabelsValue> = {
    label: t('views:repos.prListFilterOptions.labels.label', 'Label'),
    value: 'label_by',
    type: FilterFieldTypes.Custom,
    parser: getParserConfig(labels, labelValueOptions),
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

  const reviewOptions = getReviewOptions()
  const reviewFilterConfig: MultiSelectFilterOptionConfig<keyof PRListFilters> = {
    label: t('views:repos.prListFilterOptions.review.label', 'Reviews'),
    value: 'review_decision',
    type: FilterFieldTypes.MultiSelect,
    filterFieldConfig: {
      options: reviewOptions
    },
    parser: {
      parse: (value: string) => {
        // Since "," can be encoded while appending to URL
        const valueArr = decodeURIComponent(value)
          .split(',')
          .filter(Boolean)
          .map(val => reviewOptions.find(option => option.value === val))
          .filter((option): option is CheckboxOptions => option !== undefined)
        return valueArr
      },
      serialize: (value: CheckboxOptions[]) => value.reduce((acc, val) => (acc += `${val.value},`), '')
    }
  }

  const customFilterOptions = [labelsFilterConfig, ...(isProjectLevel ? [reviewFilterConfig] : [])]

  const PR_FILTER_OPTIONS = getPRListFilterOptions({
    t,
    onAuthorSearch: searchText => {
      setPrincipalsSearchQuery?.(searchText)
    },
    isProjectLevel,
    isPrincipalsLoading,
    customFilterOptions,
    principalData: userSelectOptions,
    scope
  })

  const handleInputChange = useCallback(
    (val: string) => {
      setSearchQuery(val.length ? val : null)
    },
    [setSearchQuery]
  )

  const handleResetSearchAndFilters = () => {
    filtersRef.current?.reset()
    setSearchQuery('')
    if (searchRef.current) {
      searchRef.current.value = ''
    }
  }

  const [selectedFiltersCnt, setSelectedFiltersCnt] = useState(0)

  const noData =
    !(pullRequests && pullRequests.length > 0) &&
    closedPullReqs === 0 &&
    openPullReqs === 0 &&
    mergedPullReqs === 0 &&
    !isProjectLevel

  const onFilterSelectionChange = (filterValues: PRListFiltersKeys[]) => {
    setSelectedFiltersCnt(filterValues.length)
  }

  const hasActiveFilters = selectedFiltersCnt > 0 || (!!searchQuery && !!searchQuery?.length)

  const showTopBar = !noData || hasActiveFilters

  const renderDirtyNoDataContent = () =>
    hasActiveFilters ? (
      <NoData
        imageName="no-search-magnifying-glass"
        title={t('views:noData.noResults', 'No search results')}
        description={[
          t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
          t('views:noData.changeSearch', 'or search for a different keyword.')
        ]}
        secondaryButton={{
          icon: 'trash',
          label: t('views:noData.clearSearch', 'Clear filters'),
          onClick: handleResetSearchAndFilters
        }}
      />
    ) : undefined

  const renderListContent = () => {
    if (isLoading) {
      return <Skeleton.List />
    }

    if (noData) {
      return hasActiveFilters ? (
        <StackedList.Root className="grow place-content-center">{renderDirtyNoDataContent()}</StackedList.Root>
      ) : (
        <NoData
          imageName="no-data-pr"
          title="No pull requests yet"
          description={
            repoId
              ? [
                  t(
                    'views:noData.noPullRequestsInRepo',
                    `Start your contribution journey by creating a new pull request.`
                  )
                ]
              : [t('views:noData.noPullRequestsInProject', `There are no pull requests in this project yet.`)]
          }
          primaryButton={
            repoId
              ? {
                  icon: 'plus',
                  label: t('views:noData.button.createPullRequest', 'Create Pull Request'),
                  to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`
                }
              : undefined
          }
        />
      )
    }

    return (
      <PullRequestListContent
        repo={repository}
        spaceId={spaceId}
        pullRequests={pullRequests || []}
        // Do not show Open and close count if project level
        closedPRs={!isProjectLevel ? closedPullReqs : undefined}
        mergedPRs={!isProjectLevel ? mergedPullReqs : undefined}
        openPRs={!isProjectLevel ? openPullReqs : undefined}
        headerFilter={prState}
        setHeaderFilter={setPrState}
        onLabelClick={onLabelClick}
        scope={scope}
        showScope={showScope}
        dirtyNoDataContent={renderDirtyNoDataContent()}
        {...routingProps}
      />
    )
  }

  const onFilterGroupChange = useCallback(
    (filterGroup: string) => {
      const searchParams = new URLSearchParams(window.location.search)
      const filtersToOmit = ['created_by', 'review_decision']
      const { rest } = splitObjectProps(Object.fromEntries(searchParams.entries()), filtersToOmit)

      if (filterGroup === PRFilterGroupTogglerOptions.All) {
        setSearchParams(
          new URLSearchParams({
            ...rest
          })
        )
      }

      if (filterGroup === PRFilterGroupTogglerOptions.Created) {
        setSearchParams(
          new URLSearchParams({
            ...rest,
            created_by: String(currentUserId)
          })
        )
      }

      if (filterGroup === PRFilterGroupTogglerOptions.ReviewRequested) {
        const originalParams = Object.fromEntries(searchParams.entries())
        setSearchParams(
          new URLSearchParams({
            ...rest,
            review_decision: originalParams.review_decision || 'pending',
            review_id: String(currentUserId)
          })
        )
      }

      setActiveFilterGrp(filterGroup as PRFilterGroupTogglerOptions)
    },
    [currentUserId, location.search, setSearchParams]
  )

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

    /**
     * Only show scope if the Scope filter is set to "All" or "Organizations and projects" only.
     */
    setShowScope(
      [ExtendedScope.All, ExtendedScope.OrgProg].includes(filterValues.include_subspaces?.value as ExtendedScope)
    )
    onFilterChange?.(_filterValues)
  }

  const getToggleCommonProps = (filterGroup: PRFilterGroupTogglerOptions): ButtonGroupBaseButtonProps => {
    return {
      onClick: () => onFilterGroupChange(filterGroup),
      className: activeFilterGrp === filterGroup ? 'z-[2]' : '',
      variant: activeFilterGrp === filterGroup ? 'primary' : 'outline'
    }
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
            <Text as="h1" variant="heading-section">
              Pull requests
            </Text>
            <Spacer size={6} />

            {!isEmpty(prCandidateBranches) && (
              <>
                <BranchCompareBannerList
                  prCandidateBranches={prCandidateBranches}
                  defaultBranchName={repository?.default_branch || 'main'}
                  repoId={repoId}
                  spaceId={spaceId}
                />
                <Spacer size={4} />
              </>
            )}

            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  ref={searchRef}
                  defaultValue={searchQuery || ''}
                  placeholder={t('views:repos.search', 'Search')}
                  inputContainerClassName="max-w-80"
                  onChange={handleInputChange}
                />
              </ListActions.Left>
              <ListActions.Right>
                {isProjectLevel && (
                  <ButtonGroup
                    buttonsProps={[
                      { children: 'All', ...getToggleCommonProps(PRFilterGroupTogglerOptions.All) },
                      { children: 'Created', ...getToggleCommonProps(PRFilterGroupTogglerOptions.Created) },
                      {
                        children: 'Review Requested',
                        ...getToggleCommonProps(PRFilterGroupTogglerOptions.ReviewRequested)
                      }
                    ]}
                    size="sm"
                  />
                )}

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
                    <Link to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
                      <IconV2 name="plus" />
                      {t('views:repos.createPullReq', 'Create Pull Request.')}
                    </Link>
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
                        sticky={filterOption.sticky}
                        defaultValue={filterOption.defaultValue}
                        key={filterOption.value}
                      >
                        {({ onChange, removeFilter, value }) =>
                          filterFieldRenderer({
                            filterOption,
                            onChange,
                            removeFilter,
                            // Increase width for Author filter to accomodate name and email as label
                            dropdownContentClassName: filterOption.value === 'created_by' ? 'w-[445px]' : '',
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
        {isProjectLevel ? (
          !!pullRequests?.length && (
            <Pagination
              indeterminate={true}
              hasPrevious={page > 1}
              hasNext={(pullRequests.length || 0) === pageSize}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
            />
          )
        ) : (
          <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
export { PullRequestListPage }
