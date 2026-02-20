import { FC, useCallback, useMemo } from 'react'

import { Button, Checkbox, IconV2, Layout, ListActions, SearchInput, Skeleton, Text } from '@harnessio/ui/components'
import { useRouterContext, useTranslation } from '@harnessio/ui/context'
import { ILabelsStore } from '@views'
import { cn } from '@harnessio/ui/utils'

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
    page,
    setPage,
    isLoading,
    getParentScopeLabels,
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
      <Layout.Horizontal gap="xs" align="center">
        <IconV2 name="tag" size="lg" />
        <Text as="h1" variant="heading-section">
          {t('views:labelData.title', 'Labels')}
        </Text>
      </Layout.Horizontal>

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
                autoFocus
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

        {!isLoading && (
          <Layout.Vertical grow gapY="none">
            <LabelsListView
              {...labelsListViewProps}
              useLabelsStore={useLabelsStore}
              handleResetQueryAndPages={handleResetQueryAndPages}
              searchQuery={searchQuery}
              toRepoLabelDetails={toRepoLabelDetails}
            />
          </Layout.Vertical>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
