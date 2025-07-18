import { FC, useCallback, useMemo } from 'react'

import { ListActions, Pagination, SearchInput, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { SearchResultItem, SearchResultsList } from './components/search-results-list'

// Define the props interface for the SearchPageView
export interface SearchPageViewProps {
  isLoading: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  useSearchResultsStore: () => {
    results: SearchResultItem[]
    page: number
    xNextPage: number
    xPrevPage: number
    setPage: (page: number) => void
  }
  toRepoFileDetails: (params: { repoPath: string; filePath: string; branch: string }) => string
}

export const SearchPageView: FC<SearchPageViewProps> = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  useSearchResultsStore,
  toRepoFileDetails
}) => {
  const { t } = useTranslation()
  const { results, page, xNextPage, xPrevPage, setPage } = useSearchResultsStore()

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
          'mx-auto': isLoading || results.length || searchQuery,
          'h-full': !isLoading && !results.length && !searchQuery
        })}
      >
        <Spacer size={2} />
        <Text variant="heading-section">{t('views:search.title', 'Search')}</Text>
        <Spacer size={6} />

        <ListActions.Root>
          <ListActions.Left>
            <SearchInput
              defaultValue={searchQuery || ''}
              onChange={handleSearchChange}
              placeholder={t('views:search.searchPlaceholder', 'Search anything...')}
              autoFocus
            />
          </ListActions.Left>
        </ListActions.Root>

        <Spacer size={4.5} />

        <SearchResultsList
          isLoading={isLoading}
          isDirtyList={isDirtyList}
          useSearchResultsStore={useSearchResultsStore}
          toRepoFileDetails={toRepoFileDetails}
          clearSearch={() => {
            setSearchQuery('')
            setPage(1)
          }}
        />

        <Spacer size={5} />

        {!isLoading && (
          <Pagination
            indeterminate={true}
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
