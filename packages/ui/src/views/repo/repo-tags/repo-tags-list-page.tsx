import { FC, useCallback, useMemo } from 'react'

import { Button, ListActions, Pagination, SearchInput, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { RepoTagsListViewProps, SandboxLayout } from '@/views'
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

  const handleSearchChange = useCallback(
    (value: string) => {
      setPage(1)
      setSearchQuery(value)
    },
    [setPage, setSearchQuery]
  )

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
          'mx-auto': isLoading || tagsList.length || searchQuery,
          'h-full': !isLoading && !tagsList.length && !searchQuery
        })}
      >
        {!isLoading && (!!tagsList.length || isDirtyList) && (
          <>
            <Spacer size={2} />
            <Text as="h1" variant="heading-section">
              {t('views:repos.tags', 'Tags')}
            </Text>
            <Spacer size={6} />
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
                <Button onClick={openCreateTagDialog}>{t('views:repos.newTag', 'New Tag')}</Button>
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
