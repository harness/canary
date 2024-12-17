import { FC } from 'react'

import { NoData, PaginationComponent, SkeletonList, Spacer, Text } from '@/components'
import {
  BranchSelector,
  BranchSelectorListItem,
  BranchSelectorTab,
  CommitsList,
  IBranchSelectorStore,
  SandboxLayout,
  TranslationStore
} from '@/views'
import { Filters, FiltersBar } from '@components/filters'
import { getFilterOptions, getSortDirections, getSortOptions } from '@views/repo/constants/filter-options'
import { useFilters } from '@views/repo/hooks'

import { TypesCommit } from './types'

export interface RepoCommitsViewProps {
  isFetchingCommits: boolean
  commitsList?: TypesCommit[] | null
  xNextPage: number
  xPrevPage: number
  page: number
  setPage: (page: number) => void
  selectBranchOrTag: (branchTag: BranchSelectorListItem, type: BranchSelectorTab) => void
  useTranslationStore: () => TranslationStore
  useRepoBranchesStore: () => IBranchSelectorStore
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const RepoCommitsView: FC<RepoCommitsViewProps> = ({
  isFetchingCommits,
  commitsList,
  xNextPage,
  xPrevPage,
  page,
  setPage,
  selectBranchOrTag,
  useTranslationStore,
  useRepoBranchesStore,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslationStore()

  const FILTER_OPTIONS = getFilterOptions(t)
  const SORT_OPTIONS = getSortOptions(t)
  const SORT_DIRECTIONS = getSortDirections(t)
  const filterHandlers = useFilters()

  const isDirtyList = page !== 1

  const handleResetFiltersAndPages = () => {
    setPage(1)
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="pt-7">
        <Text size={5} weight={'medium'}>
          Commits
        </Text>
        <Spacer size={6} />
        <div className="flex justify-between gap-5">
          <BranchSelector
            onSelectBranch={selectBranchOrTag}
            useRepoBranchesStore={useRepoBranchesStore}
            useTranslationStore={useTranslationStore}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Filters filterOptions={FILTER_OPTIONS} sortOptions={SORT_OPTIONS} filterHandlers={filterHandlers} t={t} />
        </div>

        <FiltersBar
          filterOptions={FILTER_OPTIONS}
          sortOptions={SORT_OPTIONS}
          sortDirections={SORT_DIRECTIONS}
          filterHandlers={filterHandlers}
          t={t}
        />

        <Spacer size={5} />

        {isFetchingCommits ? (
          <SkeletonList />
        ) : (
          <>
            {!commitsList?.length ? (
              <NoData
                withBorder
                textWrapperClassName="max-w-[350px]"
                iconName={isDirtyList ? 'no-search-magnifying-glass' : 'no-data-commits'}
                title={isDirtyList ? 'No commits history' : 'No commits yet'}
                description={[
                  isDirtyList
                    ? 'There isn’t any commit history to show here for the selected user, time range, or current page.'
                    : "Your commits will appear here once they're made. Start committing to see your changes reflected."
                ]}
                primaryButton={
                  isDirtyList
                    ? { label: 'Clear filters', onClick: handleResetFiltersAndPages }
                    : // TODO: add onClick for Creating new commit
                      { label: 'Create new commit' }
                }
              />
            ) : (
              <>
                <CommitsList data={commitsList} />
                <PaginationComponent
                  className="pl-[26px]"
                  nextPage={xNextPage}
                  previousPage={xPrevPage}
                  currentPage={page}
                  goToPage={setPage}
                  t={t}
                />
              </>
            )}
          </>
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
