import { FC, useCallback, useMemo } from 'react'

import { Button, Checkbox, ListActions, Pagination, SearchInput, Skeleton, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { ILabelsStore, SandboxLayout } from '@/views'

import { LabelsListView, LabelsListViewProps } from './components/labels-list-view'

export interface LabelsListPageProps {
  useLabelsStore: () => ILabelsStore
  createdIn?: string
  showSpacer?: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  isRepository?: boolean
  labelsListViewProps: Pick<LabelsListViewProps, 'handleDeleteLabel' | 'handleEditLabel' | 'widthType'>
  className?: string
}

export const LabelsListPage: FC<LabelsListPageProps> = ({
  useLabelsStore,
  searchQuery,
  setSearchQuery,
  isRepository = false,
  labelsListViewProps,
  createdIn,
  className
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
    // <SandboxLayout.Main>
    <SandboxLayout.Content className={className}>
      <Text as="h1" variant="heading-section" className="mb-6">
        {t('views:labelData.title', 'Labels')}
      </Text>

      {isRepository && (
        <div className="mb-[18px]">
          <Checkbox
            id="parent-labels"
            checked={getParentScopeLabels}
            onCheckedChange={setGetParentScopeLabels}
            label={t('views:labelData.showParentLabels', 'Show labels from parent scopes')}
          />
        </div>
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
              <Link to="create">{t('views:labelData.newLabel', 'New label')}</Link>
            </Button>
          </ListActions.Right>
        </ListActions.Root>
      )}

      {isLoading && <Skeleton.List className="mb-8 mt-5" />}

      {!isLoading && (
        <LabelsListView
          {...labelsListViewProps}
          labels={spaceLabels}
          labelContext={{ space: space_ref, repo: repo_ref }}
          createdIn={createdIn}
          handleResetQueryAndPages={handleResetQueryAndPages}
          searchQuery={searchQuery}
          values={spaceValues}
        />
      )}

      <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page} goToPage={setPage} />
    </SandboxLayout.Content>
  )
}
