import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import { useListReposQuery } from '@harnessio/code-service-client'
import { SearchPageView, SearchResultItem, SemanticSearchResultItem, Stats } from '@harnessio/ui/views'

import { useMFEContext } from '../framework/hooks/useMFEContext'
import { parseAsBoolean, useQueryState } from '../framework/hooks/useQueryState'
import { useAPIPath } from '../hooks/useAPIPath'
import { transformRepoList } from './repo/transform-utils/repo-list-transform'

interface TData {
  file_matches: SearchResultItem[]
  stats: Stats
}

interface TVariables {
  query: string
}

type TError = unknown

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useQueryState('query')
  const [selectedRepoId, setSelectedRepoId] = useQueryState('repo')
  const [selectedLanguage, setSelectedLanguage] = useQueryState('language')
  const [regexEnabled, setRegexEnabled] = useQueryState<boolean>('regexEnabled', parseAsBoolean)
  const [semanticEnabled, setSemanticEnabled] = useQueryState<boolean>('semantic', parseAsBoolean)
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [semanticSearchResults, setSemanticSearchResults] = useState<SemanticSearchResultItem[]>([])
  const [stats, setStats] = useState<Stats>()
  const getApiPath = useAPIPath()
  const { scope } = useMFEContext()
  const { repoId } = useParams()

  const scopeRef = [scope.accountId, scope.orgIdentifier, scope.projectIdentifier].filter(Boolean).join('/')
  const repoRef = `${scopeRef}/${repoId || selectedRepoId}`

  const { data: { body: repos } = {}, isLoading: isReposListLoading } = useListReposQuery(
    {
      queryParams: {
        page: 1,
        query: ''
      },
      space_ref: `${scopeRef}/+`
    },
    {
      enabled: !repoId
    }
  )

  const { mutate: searchMutation, isLoading: searchLoading } = useMutation<TData, TError, TVariables>({
    mutationFn: ({ query }) =>
      fetch(getApiPath('/api/v1/search'), {
        method: 'POST',
        body: JSON.stringify({
          repo_paths: repoId || selectedRepoId ? [repoRef] : [],
          space_paths: repoId || selectedRepoId ? [] : [scopeRef],
          query: `( ${query} ) case:no${selectedLanguage ? ` lang:${selectedLanguage}` : ''}`,
          max_result_count: 50,
          recursive: false,
          enable_regex: regexEnabled
        })
      }).then(res => res.json()),
    onSuccess: data => {
      setSearchResults(
        data.file_matches.map(file => {
          return {
            ...file,
            // repo_path contains accountid/orgid/projectid which doesn't need to be displayed
            repo_path: file.repo_path
              .replace(scope.accountId + '/', '')
              .replace(scope.orgIdentifier + '/', '')
              .replace(scope.projectIdentifier + '/', '')
          }
        })
      )
      setStats(data.stats)
    }
  })

  const { mutate: semanticSearchMutation, isLoading: semanticSearchLoading } = useMutation<
    SemanticSearchResultItem[],
    TError,
    TVariables
  >({
    mutationFn: ({ query }) =>
      fetch(getApiPath(`/api/v1/repos/${repoRef}/+/semantic/search`), {
        method: 'POST',
        body: JSON.stringify({
          query
        })
      }).then(res => res.json()),
    onSuccess: data => {
      setSemanticSearchResults(data)
      setStats({
        total_files: data.length
      })
    }
  })

  useEffect(() => {
    if (searchQuery.trim() !== '' && !semanticEnabled) {
      searchMutation({ query: searchQuery })
    }
  }, [searchQuery, searchMutation, regexEnabled, selectedRepoId, selectedLanguage, semanticEnabled])

  useEffect(() => {
    if (searchQuery.trim() !== '' && semanticEnabled) {
      semanticSearchMutation({ query: searchQuery })
    }
  }, [searchQuery, semanticSearchMutation, semanticEnabled])

  return (
    <SearchPageView
      isLoading={searchLoading || semanticSearchLoading}
      searchQuery={searchQuery}
      setSearchQuery={q => q && setSearchQuery(q)}
      regexEnabled={regexEnabled}
      setRegexEnabled={setRegexEnabled}
      semanticEnabled={semanticEnabled}
      setSemanticEnabled={setSemanticEnabled}
      stats={stats}
      useSearchResultsStore={() => {
        return {
          results: searchResults,
          semanticResults: semanticSearchResults,
          page: 1,
          xNextPage: 0,
          xPrevPage: 0,
          setPage: () => {},
          setPaginationFromHeaders: () => {}
        }
      }}
      toRepoFileDetails={({ repoPath, filePath, branch }) =>
        repoPath && branch
          ? `/repos/${repoPath}/code/refs/heads/${branch}/~/${filePath}`
          : // TODO: get default branch
            `/repos/${repoRef}/code/refs/heads/main/~/${filePath}`
      }
      // language filter props
      selectedLanguage={selectedLanguage}
      onLanguageSelect={language => {
        setSelectedLanguage(language)
      }}
      // repo filter props
      repos={repos ? transformRepoList(repos) : undefined}
      isReposListLoading={isReposListLoading}
      selectedRepoId={selectedRepoId}
      onRepoSelect={(repoName: string) => {
        setSelectedRepoId(repoName)
      }}
      onClearFilters={() => {
        setSelectedRepoId(null)
        setSelectedLanguage(null)
      }}
    />
  )
}
