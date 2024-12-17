import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Filters, FiltersBar } from '@components/filters'
import { Button, ListActions, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@components/index'
import { useCommonFilter } from '@hooks/use-common-filter'
import {
  getFilterOptions,
  getLayoutOptions,
  getSortDirections,
  getSortOptions
} from '@views/repo/constants/filter-options'
import { useFilters, useViewManagement } from '@views/repo/hooks'
import { filterWebhooks } from '@views/repo/utils/filtering/webhooks'
import { formatWebhooks } from '@views/repo/utils/formatting/webhooks'
import { sortWebhooks } from '@views/repo/utils/sorting/webhooks'

import { SandboxLayout } from '../../../index'
import { RepoWebhookList } from './repo-webhook-list'
import { WebhookListProps } from './types'

const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

const RepoWebhookListPage: React.FC<WebhookListProps> = ({ useWebhookStore, useTranslationStore }) => {
  const { t } = useTranslationStore()

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)
  const LAYOUT_OPTIONS = getLayoutOptions(t)

  const [currentLayout, setCurrentLayout] = useState(LAYOUT_OPTIONS[1].value)

  // State for storing saved filters and sorts
  // null means no saved state exists
  const navigate = useNavigate()
  const { webhooks, totalPages, page, setPage, webhookLoading, error } = useWebhookStore()

  const handleNavigate = () => {
    navigate('create')
  }

  /**
   * Initialize filters hook with handlers for managing filter state
   */
  const filterHandlers = useFilters()
  const viewManagement = useViewManagement({
    storageKey: 'repo-webhook-list-filters',
    setActiveFilters: filterHandlers.setActiveFilters,
    setActiveSorts: filterHandlers.setActiveSorts
  })

  const filteredWebhooks = filterWebhooks(webhooks, filterHandlers.activeFilters)
  const sortedWebhooks = sortWebhooks(filteredWebhooks, filterHandlers.activeSorts)
  const webhooksWithFormattedDates = formatWebhooks(sortedWebhooks)

  const { query, handleSearch } = useCommonFilter()
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(query || '')
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value)
    handleSearch(e)
  }

  const handleResetQuery = () => {
    setValue('')
    handleSearch({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
  }
  if (webhookLoading)
    return (
      <SandboxLayout.Main>
        <SandboxLayout.Content>
          <SkeletonList />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )

  if (error)
    return (
      <SandboxLayout.Main>
        <SandboxLayout.Content>
          <Spacer size={2} />
          <Text size={1} className="text-destructive">
            {error || 'Something went wrong'}
          </Text>
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  return (
    <>
      <SandboxLayout.Content className="ml-0">
        <Text size={5} weight={'medium'}>
          Webhooks
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-96"
              value={value}
              handleChange={handleInputChange}
              placeholder="Search"
            />
          </ListActions.Left>
          <ListActions.Right>
            <Filters
              filterOptions={FILTER_OPTIONS}
              sortOptions={SORT_OPTIONS}
              filterHandlers={filterHandlers}
              layoutOptions={LAYOUT_OPTIONS}
              currentLayout={currentLayout}
              onLayoutChange={setCurrentLayout}
              viewManagement={viewManagement}
              t={t}
            />
            <Button variant="default" asChild>
              <Link to="create">New webhook</Link>
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
        <Spacer size={5} />
        <RepoWebhookList
          error={error}
          loading={webhookLoading}
          webhooks={webhooksWithFormattedDates}
          LinkComponent={LinkComponent}
          handleResetFilters={filterHandlers.handleResetFilters}
          hasActiveFilters={filterHandlers.activeFilters.length > 0}
          query={query ?? ''}
          handleResetQuery={handleResetQuery}
          handleNavigate={handleNavigate}
        />
        <Spacer size={8} />
        <PaginationComponent totalPages={totalPages} currentPage={page} goToPage={page => setPage(page)} t={t} />
      </SandboxLayout.Content>
    </>
  )
}

export { RepoWebhookListPage }
