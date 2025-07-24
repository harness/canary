import { FC, useCallback, useMemo } from 'react'

import { Button, Layout, Pagination, SearchInput, Select, Spacer, Text, Toggle } from '@/components'
import { useTranslation } from '@/context'
import { RepositoryType, SandboxLayout } from '@/views'
import { cn } from '@utils/cn'

import { SearchResultItem, SearchResultsList } from './components/search-results-list'

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

// Define the props interface for the SearchPageView
export interface SearchPageViewProps {
  isLoading: boolean
  searchQuery: string | null
  setSearchQuery: (query: string | null) => void
  regex: boolean
  setRegex: (selected: boolean) => void
  useSearchResultsStore: () => {
    results: SearchResultItem[]
    page: number
    xNextPage: number
    xPrevPage: number
    setPage: (page: number) => void
  }
  stats?: {
    total_files: number
    total_matches: number
  }
  // repo filter props
  repos?: RepositoryType[]
  selectedRepoId?: string
  isReposListLoading?: boolean
  onRepoSelect: (repoName: string) => void
  // language filter props
  selectedLanguage?: string
  onLanguageSelect: (language: string) => void
  onClearFilters: () => void
  toRepoFileDetails: (params: { repoPath: string; filePath: string; branch: string }) => string
}

export const SearchPageView: FC<SearchPageViewProps> = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  regex,
  setRegex,
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
        <Text as="h1" variant="heading-section">
          {t('views:search.title', 'Search')}
        </Text>
        <Spacer size={6} />

        <SearchInput
          defaultValue={searchQuery || ''}
          onChange={handleSearchChange}
          placeholder={t('views:search.searchPlaceholder', 'Search anything...')}
          suffix={
            <Toggle
              defaultValue={regex}
              onChange={setRegex}
              iconOnly
              prefixIcon="regex"
              prefixIconProps={{
                size: 'md'
              }}
              tooltipProps={{ content: 'Enable Regex' }}
            />
          }
          autoFocus
        />
        <Spacer size={5} />
        {results.length > 0 || selectedLanguage || selectedRepoId ? (
          <Layout.Horizontal gap="sm">
            {repos ? (
              <Select
                isLoading={isReposListLoading}
                label={t('views:search.repository', 'Repository')}
                onChange={value => onRepoSelect?.(value)}
                value={selectedRepoId}
                options={repos.map(repo => ({ label: repo.name, value: repo.name }))}
                placeholder={t('views:search.repositoryPlaceholder', 'Select a repository')}
                orientation="horizontal"
              />
            ) : null}
            <Select
              label={t('views:search.language', 'Language')}
              onChange={value => onLanguageSelect?.(value)}
              options={languageOptions}
              value={selectedLanguage}
              placeholder={'Select a language'}
              orientation="horizontal"
            />
            <Button variant={'secondary'} onClick={onClearFilters}>
              Clear Filters
            </Button>
          </Layout.Horizontal>
        ) : null}

        <Spacer size={5} />

        {!isLoading && stats && results.length > 0 && (
          <Text variant={'caption-normal'}>
            {t('views:search.statsText', '{{matchCount}} matches found across {{fileCount}} files', {
              matchCount: stats.total_matches,
              fileCount: stats.total_files
            })}
          </Text>
        )}

        <Spacer size={5} />

        <SearchResultsList
          isLoading={isLoading}
          isDirtyList={isDirtyList}
          useSearchResultsStore={useSearchResultsStore}
          toRepoFileDetails={toRepoFileDetails}
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
