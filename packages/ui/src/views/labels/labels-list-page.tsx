import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  Checkbox,
  ListActions,
  Option,
  PaginationComponent,
  SearchBox,
  SkeletonList,
  Spacer
} from '@/components'
import { useDebounceSearch } from '@/hooks'
import { ILabelsStore, ILabelType, SandboxLayout, TranslationStore } from '@/views'

import { LabelsListView } from './components/labels-list-view'

export interface LabelsListPageProps {
  useTranslationStore: () => TranslationStore
  useLabelsStore: () => ILabelsStore
  createdIn?: string
  handleEditLabel: (label: ILabelType) => void
  handleDeleteLabel: (identifier: string) => void
  showSpacer?: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  isLoading: boolean
  isRepository?: boolean
}

export const LabelsListPage: FC<LabelsListPageProps> = ({
  useTranslationStore,
  useLabelsStore,
  handleEditLabel,
  handleDeleteLabel,
  searchQuery,
  setSearchQuery,
  isLoading,
  isRepository = false
}) => {
  const { t } = useTranslationStore()
  const {
    labels: spaceLabels,
    totalPages,
    page,
    setPage,
    values: spaceValues,
    getParentScopeLabels,
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
      <SandboxLayout.Content className="px-0">
        <h1 className="text-2xl font-medium text-foreground-1">{t('views:labelData.title', 'Labels')}</h1>
        <Spacer size={6} />
        {isRepository && (
          <Option
            className="mb-[18px]"
            control={
              <Checkbox
                checked={getParentScopeLabels}
                onCheckedChange={setGetParentScopeLabels}
                id="show-parent-labels"
              />
            }
            id="show-parent-labels"
            label={t('views:labelData.showParentLabels', 'Show labels from parent scopes')}
          />
        )}

        {(!!spaceLabels.length || (!spaceLabels.length && isDirtyList)) && (
          <>
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
          </>
        )}
        <Spacer size={5} />
        {isLoading ? (
          <SkeletonList />
        ) : (
          <LabelsListView
            labels={spaceLabels}
            useLabelsStore={useLabelsStore}
            handleDeleteLabel={handleDeleteLabel}
            handleEditLabel={handleEditLabel}
            useTranslationStore={useTranslationStore}
            isDirtyList={isDirtyList}
            handleResetQueryAndPages={handleResetQueryAndPages}
            searchQuery={searchQuery}
            values={spaceValues}
          />
        )}

        <Spacer size={8} />
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          goToPage={(pageNum: number) => setPage(pageNum)}
          t={t}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
