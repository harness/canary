import { FC, useMemo } from 'react'

import { Button, ListActions, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'

import { LabelsListView } from './components/labels-list-view'
import { ProjectLabelPageProps } from './types'

export const ProjectLabelsListView: FC<ProjectLabelPageProps> = ({
  useTranslationStore,
  useLabelsStore,
  openCreateLabelDialog,
  handleEditLabel,
  handleDeleteLabel,
  showSpacer = true,
  searchQuery,
  setSearchQuery,
  isLoadingSpaceLabels
}) => {
  const { t } = useTranslationStore()
  const { labels: spaceLabels, totalPages, page, setPage, values: spaceValues } = useLabelsStore()

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

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="3xl">
        {showSpacer && <Spacer size={10} />}
        <Text size={5} weight={'medium'}>
          Labels
        </Text>
        <Spacer size={6} />
        {(!!spaceLabels.length || (!spaceLabels.length && isDirtyList)) && (
          <>
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
                <Button variant="default" onClick={openCreateLabelDialog}>
                  New label
                </Button>
              </ListActions.Right>
            </ListActions.Root>
          </>
        )}
        <Spacer size={5} />
        {isLoadingSpaceLabels ? (
          <SkeletonList />
        ) : (
          <LabelsListView
            labels={spaceLabels}
            useLabelsStore={useLabelsStore}
            handleDeleteLabel={handleDeleteLabel}
            handleEditLabel={handleEditLabel}
            useTranslationStore={useTranslationStore}
            isDirtyList={isDirtyList}
            handleResetSearch={handleResetSearch}
            searchQuery={searchQuery}
            openCreateLabelDialog={openCreateLabelDialog}
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
