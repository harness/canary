import { FC, useMemo } from 'react'

import { Button, ListActions, Pagination, SearchBox, Spacer } from '@/components'
import { SandboxLayout } from '@/views'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'

import { BranchesList } from './components/branch-list'
import { RepoBranchListViewProps } from './types'

export const RepoBranchListView: FC<RepoBranchListViewProps> = ({
  isLoading,
  useRepoBranchesStore,
  useTranslationStore,
  setCreateBranchDialogOpen,
  searchQuery,
  setSearchQuery,
  onDeleteBranch,
  ...routingProps
}) => {
  const { t } = useTranslationStore()
  const { branchList, defaultBranch, xNextPage, xPrevPage, page, setPage } = useRepoBranchesStore()

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  const handleResetFiltersAndPages = () => {
    setPage(1)
    setSearchQuery(null)
  }

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !branchList.length && !searchQuery })}>
        <Spacer size={2} />
        {(isLoading || !!branchList.length || isDirtyList) && (
          <>
            <span className="text-24 text-cn-foreground-1 font-medium">{t('views:repos.branches', 'Branches')}</span>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-80"
                  value={search || ''}
                  handleChange={handleSearchChange}
                  placeholder={t('views:repos.search', 'Search')}
                />
              </ListActions.Left>
              <ListActions.Right>
                <Button
                  onClick={() => {
                    setCreateBranchDialogOpen(true)
                  }}
                >
                  {t('views:repos.newBranch', 'New branch')}
                </Button>
              </ListActions.Right>
            </ListActions.Root>

            <Spacer size={5} />
          </>
        )}
        <BranchesList
          isLoading={isLoading}
          defaultBranch={defaultBranch}
          branches={branchList}
          useTranslationStore={useTranslationStore}
          setCreateBranchDialogOpen={setCreateBranchDialogOpen}
          handleResetFiltersAndPages={handleResetFiltersAndPages}
          onDeleteBranch={onDeleteBranch}
          isDirtyList={isDirtyList}
          {...routingProps}
        />
        {!isLoading && (
          <Pagination nextPage={xNextPage} previousPage={xPrevPage} currentPage={page} goToPage={setPage} t={t} />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
