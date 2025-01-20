import { ChangeEvent, useMemo, useState } from 'react'

import {
  Button,
  Checkbox,
  Label,
  ListActions,
  PaginationComponent,
  SearchBox,
  SkeletonList,
  Spacer,
  Text
} from '@/components'
import { SandboxLayout } from '@/views'
import { LabelsListView } from '@views/project/project-labels/components/labels-list-view'
import { debounce } from 'lodash-es'

import { RepoLabelPageProps } from './types'

export const RepoLabelsListView: React.FC<RepoLabelPageProps> = ({
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
  const { repoLabels, totalPages, page, setPage, repoValues, setGetParentScopeLabels, getParentScopeLabels } =
    useLabelsStore()
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

  const filteredLabels = useMemo(() => {
    return getParentScopeLabels ? repoLabels : repoLabels?.filter(label => label.scope === 0)
  }, [repoLabels, getParentScopeLabels])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="3xl">
        {showSpacer && <Spacer size={10} />}
        <Text size={5} weight={'medium'}>
          Labels
        </Text>
        <Spacer size={6} />
        {(!!repoLabels.length || (!repoLabels.length && isDirtyList)) && (
          <>
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-96"
                  value={searchInput || ''}
                  handleChange={handleInputChange}
                  placeholder={t('views:repos.search')}
                />
                <div className="flex gap-2">
                  <Checkbox
                    checked={getParentScopeLabels}
                    onCheckedChange={() => setGetParentScopeLabels(!getParentScopeLabels)}
                    id="show-parent-labels"
                  />
                  <Label>Show parent lables</Label>
                </div>
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
            labels={filteredLabels}
            useLabelsStore={useLabelsStore}
            handleDeleteLabel={handleDeleteLabel}
            handleEditLabel={handleEditLabel}
            useTranslationStore={useTranslationStore}
            isDirtyList={isDirtyList}
            handleResetSearch={handleResetSearch}
            searchQuery={searchQuery}
            openCreateLabelDialog={openCreateLabelDialog}
            values={repoValues}
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
