import { FC, useMemo } from 'react'

import { Button, Checkbox, ListActions, Pagination, SearchBox, SkeletonList } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { ILabelsStore, SandboxLayout, TranslationStore } from '@/views'

import { LabelsListView, LabelsListViewProps } from './components/labels-list-view'

export interface LabelsListPageProps {
  useTranslationStore: () => TranslationStore
  useLabelsStore: () => ILabelsStore
  createdIn?: string
  showSpacer?: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  isRepository?: boolean
  className?: string
  labelsListViewProps: Pick<LabelsListViewProps, 'handleDeleteLabel' | 'handleEditLabel' | 'widthType'>
}

export const LabelsListPage: FC<LabelsListPageProps> = ({
  useTranslationStore,
  useLabelsStore,
  searchQuery,
  setSearchQuery,
  isRepository = false,
  className,
  labelsListViewProps
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()
  const {
    labels: spaceLabels,
    totalPages,
    page,
    setPage,
    isLoading,
    values: spaceValues,
    getParentScopeLabels,
    space_ref,
    repo_ref,
    setGetParentScopeLabels
  } = useLabelsStore()

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetQueryAndPages = () => {
    handleResetSearch()
    setPage(1)
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className={className}>
        <h1 className="mb-6 text-2xl font-medium text-cn-foreground-1">{t('views:labelData.title', 'Labels')}</h1>

        {isRepository && (
          <div className="mb-[18px]">
            <Checkbox
              id="parent-labels"
              optional
              checked={getParentScopeLabels}
              onCheckedChange={setGetParentScopeLabels}
              label={t('views:labelData.showParentLabels', 'Show labels from parent scopes')}
            />
          </div>
        )}

        {(!!spaceLabels.length || isDirtyList) && (
          <ListActions.Root>
            <ListActions.Left>
              <SearchBox.Root
                width="full"
                className="max-w-96"
                value={searchInput}
                handleChange={handleInputChange}
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

        {isLoading && <SkeletonList className="mb-8 mt-5" />}

        {!isLoading && (
          <div className="mb-8 mt-5">
            <LabelsListView
              {...labelsListViewProps}
              labels={spaceLabels}
              labelContext={{ space: space_ref, repo: repo_ref }}
              useTranslationStore={useTranslationStore}
              handleResetQueryAndPages={handleResetQueryAndPages}
              searchQuery={searchQuery}
              values={spaceValues}
            />
          </div>
        )}

        <Pagination totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
