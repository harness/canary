import { FC, useCallback, useMemo } from 'react'

import { Button, Layout, SearchInput, Select, Text, Toggle } from '@/components'
import { useTranslation } from '@/context'
import { RepositoryType, SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { SearchResultItem, SearchResultsList } from './components/search-results-list'
import { SemanticSearchResultItem, SemanticSearchResultsList } from './components/semantic-search-results-list'
import { getScopeOptions } from './utils/utils'

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
  showSemanticSearch: boolean
  semanticEnabled: boolean
  setSemanticEnabled: (selected: boolean) => void
  isRepoScope: boolean
  onRecursiveToggle: (recursive: boolean) => void
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
  // routing paths
  toRepoFileDetails: (params: { repoPath?: string; filePath: string; branch?: string }) => string
  toRepo: (params: { repoPath?: string }) => string
  scope: { accountId: string; orgIdentifier?: string; projectIdentifier?: string }
}

export const SearchPageView: FC<SearchPageViewProps> = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  regexEnabled,
  setRegexEnabled,
  showSemanticSearch,
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
  onRecursiveToggle,
  isReposListLoading,
  selectedLanguage,
  onLanguageSelect,
  onRepoSelect,
  onClearFilters,
  toRepo,
  scope
}) => {
  const { t } = useTranslation()
  const { results, semanticResults, page, setPage } = useSearchResultsStore()

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

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content
        className={cn({
          'mx-auto': isLoading || results?.length || searchQuery,
          'h-full': !isLoading && !results?.length && !searchQuery
        })}
      >
        <Layout.Vertical gapY="xl" className="grow">
          <SearchInput
            inputContainerClassName="[&>.cn-input-suffix]:border-0 [&>.cn-input-suffix]:px-cn-xs"
            defaultValue={searchQuery || ''}
            onChange={handleSearchChange}
            placeholder={t('views:search.searchPlaceholder', 'Search anything...')}
            autoFocus
            suffix={
              <Layout.Horizontal gap="2xs" align="center">
                {isRepoScope && showSemanticSearch && (
                  <Toggle
                    selected={semanticEnabled}
                    onChange={setSemanticEnabled}
                    prefixIcon="sparks"
                    rounded
                    text="AI Search"
                    size="xs"
                    tooltipProps={{ content: 'Toggle AI Semantic Search' }}
                  />
                )}

                {!semanticEnabled && (
                  <Toggle
                    selected={regexEnabled}
                    onChange={setRegexEnabled}
                    iconOnly
                    variant="ghost"
                    prefixIcon="regex"
                    size="xs"
                    tooltipProps={{ content: 'Toggle Regex Search' }}
                  />
                )}
              </Layout.Horizontal>
            }
          />

          {!semanticEnabled && ((results && results.length > 0) || selectedLanguage || selectedRepoId) ? (
            <Layout.Horizontal gap="xs">
              {!scope.projectIdentifier ? (
                <Select
                  options={getScopeOptions(scope)}
                  onChange={value => (value === 'all' ? onRecursiveToggle(true) : onRecursiveToggle(false))}
                  placeholder={t('views:search.scopePlaceholder', 'Select a scope')}
                />
              ) : null}
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
          ) : null}

          <Layout.Vertical gapY="md" className="grow">
            {!isLoading && !semanticEnabled && stats && results && results.length > 0 && (
              <Text>
                Results:{' '}
                <Text variant="body-strong" color="foreground-1" as="span">
                  {t(
                    'views:search.statsText.matchesAndFiles',
                    '{{matchCount}} matches found in {{fileCount}} file(s)',
                    { matchCount: stats.total_matches, fileCount: stats.total_files }
                  )}
                </Text>
              </Text>
            )}
            {!isLoading && semanticEnabled && stats && semanticResults && semanticResults.length > 0 && (
              <Text>
                Results:{' '}
                <Text variant="body-strong" color="foreground-1" as="span">
                  {t('views:search.statsText.files', '{{fileCount}} file(s)', { fileCount: stats.total_files })}
                </Text>
              </Text>
            )}

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
                toRepo={toRepo}
                searchError={searchError}
                isRepoScope={isRepoScope}
                onClearFilters={onClearFilters}
              />
            )}
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
