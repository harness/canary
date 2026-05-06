import { FC, useCallback } from 'react'

import { Button, Dialog, IconV2, Layout, ListActions, Page, SearchInput } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { RepoTagsListViewProps } from '@views'
import { cn } from '@harnessio/ui/utils'

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
  const { tags: tagsList, setPage } = useRepoTagsStore()

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

  return (
    <Page.Root>
      {(!!tagsList?.length || !!searchQuery) && (
        <Page.HeaderV2
          title={t('views:repos.tags', 'Tags')}
          iconName="tag"
          actions={
            <Dialog.Trigger>
              <Button onClick={openCreateTagDialog}>
                <IconV2 name="plus" />
                <span>{t('views:repos.createTag', 'Create Tag')}</span>
              </Button>
            </Dialog.Trigger>
          }
        />
      )}
      <Page.Content
        className={cn({
          'mx-auto': isLoading || tagsList.length || searchQuery,
          'h-full': !isLoading && !tagsList.length && !searchQuery
        })}
      >
        <Layout.Vertical gap="xl" className="flex-1">
          <Layout.Vertical gap="md" className="flex-1">
            {(!!tagsList?.length || !!searchQuery) && (
              <ListActions.Root>
                <ListActions.Left>
                  <SearchInput
                    inputContainerClassName="max-w-80"
                    defaultValue={searchQuery || ''}
                    onChange={handleSearchChange}
                    placeholder={t('views:repos.search', 'Search')}
                  />
                </ListActions.Left>
              </ListActions.Root>
            )}

            <Layout.Vertical gap="none" className="flex-1">
              <RepoTagsList
                onDeleteTag={onDeleteTag}
                useRepoTagsStore={useRepoTagsStore}
                toCommitDetails={toCommitDetails}
                onOpenCreateBranchDialog={openCreateBranchDialog}
                isLoading={isLoading}
                onResetFiltersAndPages={handleResetFiltersAndPages}
                onOpenCreateTagDialog={openCreateTagDialog}
                searchQuery={searchQuery}
              />
            </Layout.Vertical>
          </Layout.Vertical>
        </Layout.Vertical>
      </Page.Content>
    </Page.Root>
  )
}
