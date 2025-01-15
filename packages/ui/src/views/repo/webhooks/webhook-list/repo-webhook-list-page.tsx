import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, Filters, FiltersBar, ListActions, SearchBox, SkeletonList, Spacer } from '@/components'
import { SandboxLayout } from '@/views'
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

import { RepoWebhookList } from './components/repo-webhook-list'
import { RepoWebhookListPageProps } from './types'

const RepoWebhookListPage: FC<RepoWebhookListPageProps> = ({
  useWebhookStore,
  useTranslationStore,
  openDeleteWebhookDialog
}) => {
  const { t } = useTranslationStore()

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)
  const LAYOUT_OPTIONS = getLayoutOptions(t)

  const [currentLayout, setCurrentLayout] = useState(LAYOUT_OPTIONS[1].value)
  const { webhooks, totalPages, page, setPage, webhookLoading, error } = useWebhookStore()

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
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(query || '')
  }, [query])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value ?? '')
    handleSearch(e)
  }

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!filterHandlers.activeFilters.length || !!query
  }, [page, filterHandlers.activeFilters, query])

  const handleResetFiltersQueryAndPages = () => {
    filterHandlers.handleResetFilters()
    setValue('')
    handleSearch({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
    setPage(1)
  }

  return (
    <SandboxLayout.Content className="px-0">
      <h1 className="text-2xl font-medium">Webhooks</h1>
      <Spacer size={6} />

      {error ? (
        <span className="text-xs text-destructive">{error || 'Something went wrong'}</span>
      ) : (
        <>
          {(!!webhooksWithFormattedDates.length || (!webhooksWithFormattedDates.length && isDirtyList)) && (
            <>
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
                  <Button asChild>
                    <Link to="create">New webhook</Link>
                  </Button>
                </ListActions.Right>
              </ListActions.Root>
              <FiltersBar
                filterOptions={FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                sortDirections={SORT_DIRECTIONS}
                filterHandlers={filterHandlers}
                viewManagement={viewManagement}
                t={t}
              />
              <Spacer size={4.5} />
            </>
          )}

          {webhookLoading ? (
            <SkeletonList />
          ) : (
            <RepoWebhookList
              error={error}
              isDirtyList={isDirtyList}
              webhooks={webhooksWithFormattedDates}
              useTranslationStore={useTranslationStore}
              handleReset={handleResetFiltersQueryAndPages}
              totalPages={totalPages}
              page={page}
              setPage={setPage}
              openDeleteWebhookDialog={openDeleteWebhookDialog}
            />
          )}
        </>
      )}
    </SandboxLayout.Content>
  )
}

export { RepoWebhookListPage }
