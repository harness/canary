import { ChangeEvent, useMemo, useState } from 'react'

import { Button, ListActions, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import { debounce } from 'lodash-es'

import { LabelsListView } from './components/labels-list-view'
import { ProjectLabelPageProps } from './types'

export const ProjectLabelsListView: React.FC<ProjectLabelPageProps> = ({
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
  const { spaceLabels, totalPages, page, setPage, spaceValues } = useLabelsStore()
  const [searchInput, setSearchInput] = useState(searchQuery)

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }
  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetSearch = () => {
    setSearchInput('')
    setSearchQuery(null)
  }

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
            // createdIn={createdIn}
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
