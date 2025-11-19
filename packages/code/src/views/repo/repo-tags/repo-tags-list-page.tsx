import { FC, useCallback } from 'react'

import { RepoTagsListViewProps, SandboxLayout } from '@/views'

import { Button, Dialog, IconV2, Layout, ListActions, SearchInput, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
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
                  <Dialog.Trigger>
                    <Button onClick={openCreateTagDialog}>
                      <IconV2 name="plus" />
                      <span>{t('views:repos.createTag', 'Create Tag')}</span>
                    </Button>
                  </Dialog.Trigger>
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
                onResetFiltersAndPages={handleResetFiltersAndPages}
                onOpenCreateTagDialog={openCreateTagDialog}
                searchQuery={searchQuery}
              />
            </Layout.Vertical>
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
