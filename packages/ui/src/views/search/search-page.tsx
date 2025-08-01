import { FC, useCallback, useMemo } from 'react'

import { Button, Layout, Pagination, SearchInput, Select, Spacer, Text, Toggle } from '@/components'
import { useTranslation } from '@/context'
import { RepositoryType, SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { SearchResultItem, SearchResultsList } from './components/search-results-list'
import { SemanticSearchResultItem, SemanticSearchResultsList } from './components/semantic-search-results-list'

const languageOptions = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'PHP', value: 'php' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Go', value: 'go' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Rust', value: 'rust' },
  { label: 'Scala', value: 'scala' }
]

export interface Stats {
  total_files: number
  total_matches?: number
}

// Define the props interface for the SearchPageView
export interface SearchPageViewProps {
  isLoading: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  regexEnabled: boolean
  setRegexEnabled: (selected: boolean) => void
  semanticEnabled: boolean
  setSemanticEnabled: (selected: boolean) => void
  isRepoScope: boolean
  semanticSearchError?: string
  searchError?: string
  useSearchResultsStore: () => {
    results?: SearchResultItem[]
    semanticResults?: SemanticSearchResultItem[]
    page: number
    xNextPage: number
    xPrevPage: number
    setPage: (page: number) => void
  }
  stats?: Stats
  // repo filter props
  repos?: RepositoryType[]
  selectedRepoId?: string
  isReposListLoading?: boolean
  onRepoSelect: (repoName: string) => void
  // language filter props
  selectedLanguage?: string
  onLanguageSelect: (language: string) => void
  onClearFilters: () => void
  toRepoFileDetails: (params: { repoPath?: string; filePath: string; branch?: string }) => string
}

export const SearchPageView: FC<SearchPageViewProps> = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  regexEnabled,
  setRegexEnabled,
  semanticEnabled,
  setSemanticEnabled,
  isRepoScope,
  semanticSearchError,
  searchError,
  useSearchResultsStore,
  stats,
  toRepoFileDetails,
  repos,
  selectedRepoId,
  isReposListLoading,
  selectedLanguage,
  onLanguageSelect,
  onRepoSelect,
  onClearFilters
}) => {
  const { t } = useTranslation()
  const { results, semanticResults, page, xNextPage, xPrevPage, setPage } = useSearchResultsStore()

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
          'mx-auto': isLoading || results?.length || searchQuery,
          'h-full': !isLoading && !results?.length && !searchQuery
        })}
      >
        <div className="relative">
          <SearchInput
            defaultValue={searchQuery || ''}
            onChange={handleSearchChange}
            placeholder={t('views:search.searchPlaceholder', 'Search anything...')}
            autoFocus
          />

          <Layout.Horizontal className="absolute right-1 top-0 h-full items-center" gap="xs">
            {isRepoScope ? (
              <Toggle
                selected={semanticEnabled}
                onChange={setSemanticEnabled}
                prefixIcon="sparks"
                rounded
                text="AI Search"
                size="xs"
                tooltipProps={{ content: 'Toggle AI Semantic Search' }}
              />
            ) : null}

            {!semanticEnabled ? (
              <Toggle
                selected={regexEnabled}
                onChange={setRegexEnabled}
                iconOnly
                variant="ghost"
                prefixIcon="regex"
                size="xs"
                tooltipProps={{ content: 'Toggle Regex Search' }}
              />
            ) : null}
          </Layout.Horizontal>
        </div>

        {!semanticEnabled && ((results && results.length > 0) || selectedLanguage || selectedRepoId) ? (
          <>
            <Spacer size={5} />
            <Layout.Horizontal gap="sm">
              {!isRepoScope && repos ? (
                <Select
                  isLoading={isReposListLoading}
                  onChange={value => onRepoSelect?.(value)}
                  value={selectedRepoId}
                  options={repos.map(repo => ({ label: repo.name, value: repo.name }))}
                  placeholder={t('views:search.repositoryPlaceholder', 'Select a repository')}
                />
              ) : null}
              <Select
                onChange={value => onLanguageSelect?.(value)}
                options={languageOptions}
                value={selectedLanguage}
                placeholder={'Select a language'}
              />
              <Button variant={'secondary'} onClick={onClearFilters}>
                Clear Filters
              </Button>
            </Layout.Horizontal>
          </>
        ) : null}

        <Spacer size={5} />

        {!isLoading && !semanticEnabled && stats && results && results.length > 0 && (
          <Layout.Horizontal gap="xs">
            <Text variant={'caption-normal'}>Results:</Text>
            <Text variant={'caption-normal'}>
              {t('views:search.statsText', '{{matchCount}} matches found in {{fileCount}} file(s)', {
                matchCount: stats.total_matches,
                fileCount: stats.total_files
              })}
            </Text>
          </Layout.Horizontal>
        )}
        {!isLoading && semanticEnabled && stats && semanticResults && semanticResults.length > 0 && (
          <Layout.Horizontal gap="xs">
            <Text variant={'caption-normal'}>Results:</Text>
            <Text variant={'caption-normal'}>
              {t('views:search.statsText', '{{fileCount}} file(s)', {
                fileCount: stats.total_files
              })}
            </Text>
          </Layout.Horizontal>
        )}

        <Spacer size={5} />

        {semanticEnabled ? (
          <SemanticSearchResultsList
            isLoading={isLoading}
            isDirtyList={isDirtyList}
            useSearchResultsStore={useSearchResultsStore}
            toRepoFileDetails={toRepoFileDetails}
            semanticSearchError={semanticSearchError}
          />
        ) : (
          <SearchResultsList
            isLoading={isLoading}
            isDirtyList={isDirtyList}
            useSearchResultsStore={useSearchResultsStore}
            toRepoFileDetails={toRepoFileDetails}
            searchError={searchError}
            isRepoScope={isRepoScope}
          />
        )}

        <Spacer size={5} />

        {!isLoading && (results?.length || semanticResults?.length) ? (
          <Pagination
            indeterminate={true}
            hasNext={xNextPage > 0}
            hasPrevious={xPrevPage > 0}
            getNextPageLink={getNextPageLink}
            getPrevPageLink={getPrevPageLink}
          />
        ) : null}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
