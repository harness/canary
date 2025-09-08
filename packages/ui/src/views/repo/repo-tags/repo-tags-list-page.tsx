import { FC, useCallback, useMemo } from 'react'

import { Button, IconV2, Layout, ListActions, Pagination, SearchInput, Text } from '@/components'
import { useTranslation } from '@/context'
import { RepoTagsListViewProps, SandboxLayout } from '@/views'
import { cn } from '@utils/cn'
import { createPaginationLinks } from '@utils/utils'

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
    setSearchQuery('')
  }, [setPage, setSearchQuery])

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const { getPrevPageLink, getNextPageLink } = useMemo(
    () => createPaginationLinks(xPrevPage, xNextPage, searchQuery),
    [xPrevPage, xNextPage, searchQuery]
  )

  const canShowPagination = useMemo(() => {
    return !isLoading && !!tagsList.length
  }, [isLoading, tagsList.length])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content
        className={cn({
          'mx-auto': isLoading || tagsList.length || searchQuery,
          'h-full': !isLoading && !tagsList.length && !searchQuery
        })}
      >
        <Layout.Vertical gap="xl" className="flex-1">
          {(!!tagsList?.length || !!searchQuery) && (
            <Text as="h1" variant="heading-section">
              {t('views:repos.tags', 'Tags')}
            </Text>
          )}
          <Layout.Vertical gap="md" className="flex-1">
            {(!!tagsList?.length || !!searchQuery) && (
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
                  <Button onClick={openCreateTagDialog}>
                    <IconV2 name="plus" />
                    <span>{t('views:repos.createTag', 'Create Tag')}</span>
                  </Button>
                </ListActions.Right>
              </ListActions.Root>
            )}

            <Layout.Vertical gap="none" className="flex-1">
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

              {canShowPagination && (
                <Pagination
                  indeterminate
                  hasNext={xNextPage > 0}
                  hasPrevious={xPrevPage > 0}
                  getNextPageLink={getNextPageLink}
                  getPrevPageLink={getPrevPageLink}
                />
              )}
            </Layout.Vertical>
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
