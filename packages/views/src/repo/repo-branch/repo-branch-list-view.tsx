import { FC, useCallback, useMemo } from 'react'

import { Button, Dialog, IconV2, Layout, ListActions, NoData, Page, SearchInput } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

import { BranchesList } from './components/branch-list'
import { RepoBranchListViewProps } from './types'

export const RepoBranchListView: FC<RepoBranchListViewProps> = ({
  isLoading,
  useRepoBranchesStore,
  setCreateBranchDialogOpen,
  searchQuery,
  setSearchQuery,
  onDeleteBranch,
  ...routingProps
}) => {
  const { t } = useTranslation()
  const { branchList, page, setPage } = useRepoBranchesStore()

  const handleResetFiltersAndPages = () => {
    setPage(1)
    setSearchQuery(null)
  }

  const handleSearchChange = useCallback(
    (value: string) => {
      setPage(1)
      setSearchQuery(value)
    },
    [setPage, setSearchQuery]
  )

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const noBranches = !branchList?.length && !isLoading && !isDirtyList
  const noSearchResults = !branchList?.length && !isLoading && isDirtyList

  const openCreateBranchDialog = useCallback(() => {
    setCreateBranchDialogOpen(true)
  }, [setCreateBranchDialogOpen])

  if (noBranches) {
    return (
      <NoData
        className="m-auto"
        imageName="no-data-branches"
        title={t('views:noData.noBranches', 'No branches yet')}
        description={[
          t('views:noData.createBranchDescription', "Your branches will appear here once they're created."),
          t('views:noData.startBranchDescription', 'Start branching to see your work organized.')
        ]}
        primaryButton={{
          icon: 'plus',
          label: t('views:repos.branches.createBranch', 'Create Branch'),
          onClick: openCreateBranchDialog
        }}
      />
    )
  }

  return (
    <Page.Root>
      <Page.HeaderV2
        title={t('views:repos.branches.title', 'Branches')}
        iconName="git-branch"
        actions={
          <Dialog.Trigger>
            <Button onClick={openCreateBranchDialog} size="md" variant="primary" theme="default">
              <IconV2 name="plus" />
              {t('views:repos.branches.createBranch', 'Create Branch')}
            </Button>
          </Dialog.Trigger>
        }
      />
      <Page.Content className={cn({ 'h-full': !isLoading && !branchList.length && !searchQuery })}>
        <Layout.Flex direction="column" gapY="xl" className="grow">
          <Layout.Grid gapY="md">
            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  defaultValue={searchQuery || ''}
                  placeholder={t('views:repos.search', 'Search')}
                  inputContainerClassName="max-w-80"
                  onChange={handleSearchChange}
                />
              </ListActions.Left>
            </ListActions.Root>

            {!noSearchResults && (
              <BranchesList
                useRepoBranchesStore={useRepoBranchesStore}
                isLoading={isLoading}
                setCreateBranchDialogOpen={setCreateBranchDialogOpen}
                handleResetFiltersAndPages={handleResetFiltersAndPages}
                onDeleteBranch={onDeleteBranch}
                searchQuery={searchQuery}
                {...routingProps}
              />
            )}
          </Layout.Grid>

          {noSearchResults && (
            <NoData
              className="grow"
              imageName="no-search-magnifying-glass"
              withBorder
              title={t('views:noData.noResults', 'No search results')}
              description={[
                t(
                  'views:noData.noResultsDescription',
                  'No branches match your search. Try adjusting your keywords or filters.',
                  { type: 'branches' }
                )
              ]}
              secondaryButton={{
                icon: 'trash',
                label: t('views:noData.clearSearch', 'Clear filters'),
                onClick: handleResetFiltersAndPages
              }}
            />
          )}
        </Layout.Flex>
      </Page.Content>
    </Page.Root>
  )
}
