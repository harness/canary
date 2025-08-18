import { FC, useCallback, useMemo } from 'react'

import { Button, Checkbox, IconV2, Layout, ListActions, Pagination, SearchInput, Skeleton, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ILabelsStore } from '@/views'
import { cn } from '@utils/cn'

import { LabelsListView, LabelsListViewProps } from './components/labels-list-view'

export interface LabelsListPageProps {
  useLabelsStore: () => ILabelsStore
  showSpacer?: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  isRepository?: boolean
  labelsListViewProps: Pick<LabelsListViewProps, 'handleDeleteLabel' | 'handleEditLabel' | 'widthType'>
  className?: string
  toRepoLabelDetails?: ({ labelId, scope }: { labelId: string; scope: number }) => string
}

export const LabelsListPage: FC<LabelsListPageProps> = ({
  useLabelsStore,
  searchQuery,
  setSearchQuery,
  isRepository = false,
  labelsListViewProps,
  className,
  toRepoLabelDetails
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslation()
  const {
    labels: spaceLabels,
    totalItems,
    pageSize,
    page,
    setPage,
    isLoading,
    values: spaceValues,
    getParentScopeLabels,
    space_ref,
    repo_ref,
    setGetParentScopeLabels
  } = useLabelsStore()

  const handleSearchChange = useCallback((val: string) => setSearchQuery(val.length ? val : null), [setSearchQuery])

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetQueryAndPages = () => {
    handleSearchChange('')
    setPage(1)
  }

  return (
    <Layout.Vertical className={cn('grow', className)} gapY="xl">
      <Text as="h1" variant="heading-section">
        {t('views:labelData.title', 'Labels')}
      </Text>

      <Layout.Vertical grow gapY="md">
        {isRepository && (
          <Checkbox
            id="parent-labels"
            checked={getParentScopeLabels}
            onCheckedChange={setGetParentScopeLabels}
            label={t('views:labelData.showParentLabels', 'Show labels from parent scopes')}
          />
        )}

        {(!!spaceLabels.length || isDirtyList) && (
          <ListActions.Root>
            <ListActions.Left>
              <SearchInput
                inputContainerClassName="max-w-80"
                defaultValue={searchQuery || ''}
                onChange={handleSearchChange}
                placeholder={t('views:repos.search', 'Search')}
              />
            </ListActions.Left>
            <ListActions.Right>
              <Button asChild>
                <Link to="create">
                  <IconV2 name="plus" />
                  {t('views:labelData.createLabel', 'Create Label')}
                </Link>
              </Button>
            </ListActions.Right>
          </ListActions.Root>
        )}

        {isLoading && <Skeleton.Table countRows={5} countColumns={3} />}

        <Layout.Vertical grow gapY="none">
          {!isLoading && (
            <>
              <LabelsListView
                {...labelsListViewProps}
                labels={spaceLabels}
                labelContext={{ space: space_ref, repo: repo_ref }}
                handleResetQueryAndPages={handleResetQueryAndPages}
                searchQuery={searchQuery}
                values={spaceValues}
                toRepoLabelDetails={toRepoLabelDetails}
              />
              <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
            </>
          )}
        </Layout.Vertical>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
