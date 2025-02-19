import { FC, useMemo } from 'react'

import {
  Button,
  CommitCopyActions,
  ListActions,
  MoreActionsTooltip,
  Pagination,
  SearchBox,
  SkeletonTable,
  Spacer,
  Table
} from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'
import { Filters, FiltersBar } from '@components/filters'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import { cn } from '@utils/cn'
import { formatDate } from '@utils/utils'
import { getFilterOptions, getSortDirections, getSortOptions } from '@views/repo/constants/filter-options'
import { useFilters } from '@views/repo/hooks'

interface RepoTagsListViewProps {
  useTranslationStore: () => TranslationStore
  isLoading: boolean
  openCreateBranchDialog: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  onDeleteTag: (tagName: string) => void
  useRepoTagsStore: () => any
}

export const RepoTagsListView: FC<RepoTagsListViewProps> = ({
  useTranslationStore,
  isLoading,
  openCreateBranchDialog,
  searchQuery,
  setSearchQuery,
  onDeleteTag,
  useRepoTagsStore
}) => {
  const { t } = useTranslationStore()
  const { tags: tagsList } = useRepoTagsStore()

  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: setSearchQuery,
    searchValue: searchQuery || ''
  })

  // const FILTER_OPTIONS = getFilterOptions(t)
  // const SORT_OPTIONS = getSortOptions(t)
  // const SORT_DIRECTIONS = getSortDirections(t)
  // const filterHandlers = useFilters()

  // const handleResetFiltersAndPages = () => {
  //   setPage(1)
  //   setSearchQuery(null)
  //   filterHandlers.handleResetFilters()
  // }

  // const isDirtyList = useMemo(() => {
  //   return page !== 1 || !!filterHandlers.activeFilters.length || !!searchQuery
  // }, [page, filterHandlers.activeFilters, searchQuery])

  return (
    <SandboxLayout.Main className="max-w-[1132px]">
      {/* <SandboxLayout.Content className={cn({ 'h-full': !isLoading && !branchList.length && !searchQuery })}> */}
      <SandboxLayout.Content>
        <Spacer size={2} />
        {/* {(isLoading || !!branchList.length || isDirtyList) && ( */}
        <>
          <span className="text-24 font-medium text-foreground-1">{t('views:repos.tags', 'Tags')}</span>
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
              {/* <Filters
                filterOptions={FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                filterHandlers={filterHandlers}
                t={t}
              /> */}
              <Button variant="default" onClick={openCreateBranchDialog}>
                {t('views:repos.newTag', 'New tag')}
              </Button>
            </ListActions.Right>
          </ListActions.Root>

          {/* <FiltersBar
            filterOptions={FILTER_OPTIONS}
            sortOptions={SORT_OPTIONS}
            sortDirections={SORT_DIRECTIONS}
            filterHandlers={filterHandlers}
            t={t}
          /> */}
          <Spacer size={5} />

          <Table.Root variant="asStackedList">
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-2/5">{t('views:repos.tag', 'Tag')}</Table.Head>
                <Table.Head className="w-1/5">{t('views:repos.commit', 'Commit')}</Table.Head>
                <Table.Head className="w-1/5">{t('views:repos.date', 'Date')}</Table.Head>
                <Table.Head className="w-1/5" />
              </Table.Row>
            </Table.Header>
            {isLoading ? (
              <SkeletonTable countRows={12} countColumns={5} />
            ) : (
              <Table.Body>
                {tagsList.map(tag => {
                  return (
                    <Table.Row key={tag.id}>
                      <Table.Cell className="content-center">{tag.name}</Table.Cell>
                      <Table.Cell className="content-center p-0">
                        <div className="max-w-[130px]">
                          <CommitCopyActions
                            sha={tag.sha}
                            toCommitDetails={_sha => {
                              return ''
                            }}
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="content-center">{formatDate(tag.tagger?.when)}</Table.Cell>

                      <Table.Cell className="text-right">
                        <MoreActionsTooltip
                          isInTable
                          actions={[
                            {
                              title: t('views:repos.createBranch', 'Create branch')
                              // to: toPullRequestCompare?.({ diffRefs: `${defaultBranch}...${branch.name}` }) || ''
                            },
                            {
                              title: t('views:repos.viewFiles', 'View Files')
                              // to: toBranchRules?.()
                            },
                            {
                              isDanger: true,
                              title: t('views:repos.deleteTag', 'Delete tag'),
                              onClick: () => onDeleteTag(tag.name)
                            }
                          ]}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            )}
          </Table.Root>

          <Spacer size={5} />
        </>
        {/* )} */}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
