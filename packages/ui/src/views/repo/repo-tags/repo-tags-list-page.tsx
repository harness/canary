import { FC, useCallback, useMemo } from 'react'

import { Button, ListActions, Pagination, SearchBox, Spacer } from '@/components'
import { useTranslation } from '@/context'
import { RepoTagsListViewProps, SandboxLayout } from '@/views'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'

import { RepoTagsList } from './components/repo-tags-list'

export const RepoTagsListView: FC<RepoTagsListViewProps> = ({
  isLoading,
  openCreateBranchDialog,
  openCreateTagDialog,
  searchQuery,
  setSearchQuery,
  onDeleteTag,
  useRepoTagsStore,
  toCommitDetails
}) => {
  const { t } = useTranslation()
  const { tags: tagsList, page, xNextPage, xPrevPage, setPage } = useRepoTagsStore()

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  const handleResetFiltersAndPages = useCallback(() => {
    setPage(1)
    setSearchQuery(null)
  }, [setPage, setSearchQuery])

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const getPrevPageLink = useCallback(() => {
    return `?page=${xPrevPage}`
  }, [xPrevPage])

  const getNextPageLink = useCallback(() => {
    return `?page=${xNextPage}`
  }, [xNextPage])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content
        className={cn({
          'max-w-[1000px] mx-auto': isLoading || tagsList.length || searchQuery,
          'h-full': !isLoading && !tagsList.length && !searchQuery
        })}
      >
        {!isLoading && (!!tagsList.length || isDirtyList) && (
          <>
            <Spacer size={2} />
            <h1 className="text-2xl font-medium text-cn-foreground-1">{t('views:repos.tags', 'Tags')}</h1>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-80"
                  value={search || ''}
                  handleChange={handleSearchChange}
                  placeholder={t('views:repos.search', 'Search')}
                  autoFocus
                />
              </ListActions.Left>
              <ListActions.Right>
                <Button onClick={openCreateTagDialog}>{t('views:repos.newTag', 'New tag')}</Button>
              </ListActions.Right>
            </ListActions.Root>

            <Spacer size={4.5} />
          </>
        )}

        <RepoTagsList
          onDeleteTag={onDeleteTag}
          useRepoTagsStore={useRepoTagsStore}
          toCommitDetails={toCommitDetails}
          onOpenCreateBranchDialog={openCreateBranchDialog}
          isLoading={isLoading}
          isDirtyList={isDirtyList}
          onResetFiltersAndPages={handleResetFiltersAndPages}
          onOpenCreateTagDialog={openCreateTagDialog}
        />

        <Spacer size={5} />

        {!isLoading && (
          <Pagination
            indeterminate
            hasNext={xNextPage > 0}
            hasPrevious={xPrevPage > 0}
            getNextPageLink={getNextPageLink}
            getPrevPageLink={getPrevPageLink}
          />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
