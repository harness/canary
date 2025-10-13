import { FC, useCallback, useMemo } from 'react'

import { Button, Dialog, IconV2, Layout, ListActions, NoData, Pagination, SearchInput, Text } from '@/components'
import { useTranslation } from '@/context'
import { createPaginationLinks } from '@/utils'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

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
  const { branchList, defaultBranch, xNextPage, xPrevPage, page, setPage, pageSize, setPageSize } =
    useRepoBranchesStore()

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

  const { getPrevPageLink, getNextPageLink } = useMemo(
    () => createPaginationLinks(xPrevPage, xNextPage, searchQuery),
    [xPrevPage, xNextPage, searchQuery]
  )

  const canShowPagination = useMemo(() => {
    return !isLoading && !!branchList.length
  }, [isLoading, branchList.length])

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
    <SandboxLayout.Main>
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !branchList.length && !searchQuery })}>
        <Layout.Flex direction="column" gapY="xl" className="grow">
          <Text as="h2" variant="heading-section">
            {t('views:repos.branches.title', 'Branches')}
          </Text>

          <Layout.Grid gapY="md">
            <ListActions.Root>
              <ListActions.Left>
                <SearchInput
                  defaultValue={searchQuery || ''}
                  placeholder={t('views:repos.search', 'Search')}
                  inputContainerClassName="max-w-80"
                  onChange={handleSearchChange}
                  autoFocus
                />
              </ListActions.Left>
              <ListActions.Right>
                <Dialog.Trigger>
                  <Button onClick={openCreateBranchDialog} size="md" variant="primary" theme="default">
                    <IconV2 name="plus" />
                    {t('views:repos.branches.createBranch', 'Create Branch')}
                  </Button>
                </Dialog.Trigger>
              </ListActions.Right>
            </ListActions.Root>

            {!noSearchResults && (
              <BranchesList
                isLoading={isLoading}
                defaultBranch={defaultBranch}
                branches={branchList}
                setCreateBranchDialogOpen={setCreateBranchDialogOpen}
                handleResetFiltersAndPages={handleResetFiltersAndPages}
                onDeleteBranch={onDeleteBranch}
                isDirtyList={isDirtyList}
                {...routingProps}
              />
            )}
          </Layout.Grid>

          {canShowPagination && (
            <Pagination
              indeterminate
              hasNext={xNextPage > 0}
              hasPrevious={xPrevPage > 0}
              getPrevPageLink={getPrevPageLink}
              getNextPageLink={getNextPageLink}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              className="!mt-0"
            />
          )}

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
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
