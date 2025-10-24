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

type TError = Error | { message?: string }

export default function SearchPage() {
  const getApiPath = useAPIPath()
  const { scope } = useMFEContext()
  const { repoId } = useParams()

  const [searchQuery, setSearchQuery] = useQueryState('query')
  const [selectedRepoId, setSelectedRepoId] = useQueryState('repo')
  const [selectedLanguage, setSelectedLanguage] = useQueryState('language')
  const [isRecursive, setIsRecursive] = useState<boolean>(false)
  const [regexEnabled, setRegexEnabled] = useQueryState<boolean>('regexEnabled', parseAsBoolean)
  const [semanticEnabled, setSemanticEnabled] = useQueryState<boolean>('semantic', parseAsBoolean)
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [semanticSearchResults, setSemanticSearchResults] = useState<SemanticSearchResultItem[]>([])
  const [stats, setStats] = useState<Stats>()

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

  const {
    mutate: searchMutation,
    isLoading: searchLoading,
    error: searchError,
    reset: resetSearch
  } = useMutation<TData, TError, TVariables>({
    mutationFn: ({ query }) =>
      fetch(getApiPath('/api/v1/search'), {
        method: 'POST',
        body: JSON.stringify({
          repo_paths: repoId || selectedRepoId ? [repoRef] : [],
          space_paths: repoId || selectedRepoId ? [] : [scopeRef],
          query: `( ${query} ) case:no${selectedLanguage ? ` lang:${selectedLanguage}` : ''}`,
          max_result_count: 50,
          recursive: isRecursive,
          enable_regex: regexEnabled
        })
      }).then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.message || `Error ${res.status}`)
          })
        }
        return res.json()
      }),
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

  const {
    mutate: semanticSearchMutation,
    isLoading: semanticSearchLoading,
    error: semanticSearchError,
    reset: resetSemanticSearch
  } = useMutation<SemanticSearchResultItem[], TError, TVariables>({
    mutationFn: ({ query }) =>
      fetch(getApiPath(`/api/v1/repos/${repoRef}/+/semantic/search`), {
        method: 'POST',
        body: JSON.stringify({
          query
        })
      }).then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.message || `Error ${res.status}`)
          })
        }
        return res.json()
      }),
    onSuccess: data => {
      setSemanticSearchResults(data)
      setStats({
        total_files: data.length
      })
    }
  })

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      setSemanticSearchResults([])
      resetSemanticSearch()
      resetSearch()
      return
    }

    if (!semanticEnabled) {
      searchMutation({ query: searchQuery })
    } else {
      semanticSearchMutation({ query: searchQuery })
    }
  }, [
    searchQuery,
    searchMutation,
    semanticSearchMutation,
    regexEnabled,
    selectedRepoId,
    selectedLanguage,
    semanticEnabled,
    isRecursive
  ])

  return (
    <SearchPageView
      isLoading={searchLoading || semanticSearchLoading}
      searchQuery={searchQuery}
      setSearchQuery={q => {
        if (!q || q.trim() === '') {
          setSearchQuery(null)
        } else {
          setSearchQuery(q)
        }
      }}
      regexEnabled={regexEnabled}
      setRegexEnabled={setRegexEnabled}
      semanticEnabled={semanticEnabled}
      setSemanticEnabled={setSemanticEnabled}
      stats={stats}
      isRepoScope={!!repoId}
      scope={scope}
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
      semanticSearchError={semanticSearchError?.message?.toString()}
      searchError={searchError?.message?.toString()}
      toRepoFileDetails={({ repoPath, filePath, branch }) =>
        repoPath && branch
          ? `/repos/${repoPath}/files/refs/heads/${branch}/~/${filePath}?keyword=${searchQuery}`
          : // TODO: get default branch
            `/repos/${repoRef}/files/refs/heads/main/~/${filePath}?keyword=${searchQuery}`
      }
      toRepo={({ repoPath }) => `/repos/${repoPath}`}
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
      onRecursiveToggle={(recursive: boolean) => {
        setIsRecursive(recursive)
      }}
      onClearFilters={() => {
        setSelectedRepoId(null)
        setSelectedLanguage(null)
      }}
    />
  )
}
