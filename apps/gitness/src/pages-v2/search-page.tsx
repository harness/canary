import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import { SearchPageView, SearchResultItem, SemanticSearchResultItem, Stats } from '@harnessio/views'

import { useMFEContext } from '../framework/hooks/useMFEContext'
import { parseAsBoolean, useQueryState } from '../framework/hooks/useQueryState'
import { useAPIPath } from '../hooks/useAPIPath'
import { encodeResourcePath } from '../utils/path-utils'
import { deriveRepoOptionsFromResults } from './search-page-utils'

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
  const { scope, customHooks } = useMFEContext()
  const { repoId } = useParams()
  const { SEMANTIC_SEARCH_ENABLED: semanticSearchEnabled } = customHooks?.useFeatureFlags() || {}

  const [searchQuery, setSearchQuery] = useQueryState('query')
  const [selectedRepoId, setSelectedRepoId] = useQueryState('repo')
  const [selectedLanguage, setSelectedLanguage] = useQueryState('language')
  const [, setSearchParams] = useSearchParams()
  const [isRecursive, setIsRecursive] = useState<boolean>(false)
  const [regexEnabled, setRegexEnabled] = useQueryState<boolean>('regexEnabled', parseAsBoolean)
  const [semanticEnabled, setSemanticEnabled] = useQueryState<boolean>('semantic', parseAsBoolean)
  const [showSemanticSearch, setShowSemanticSearch] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [semanticSearchResults, setSemanticSearchResults] = useState<SemanticSearchResultItem[]>([])
  const [stats, setStats] = useState<Stats>()

  const scopeRef = [scope.accountId, scope.orgIdentifier, scope.projectIdentifier].filter(Boolean).join('/')
  const repoRef = `${scopeRef}/${repoId || selectedRepoId}`

  const repoOptions = useMemo(
    () => deriveRepoOptionsFromResults(searchResults, selectedRepoId),
    [searchResults, selectedRepoId]
  )

  const handleClearFilters = useCallback(() => {
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev.toString())
        next.delete('repo')
        next.delete('language')
        return next
      },
      { replace: true }
    )
  }, [setSearchParams])

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

  useEffect(() => {
    setShowSemanticSearch(!!semanticSearchEnabled)
  }, [semanticSearchEnabled])

  useEffect(() => {
    if (searchQuery.trim() === '' && (selectedRepoId || selectedLanguage)) {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev.toString())
          next.delete('repo')
          next.delete('language')
          return next
        },
        { replace: true }
      )
    }
  }, [searchQuery, selectedRepoId, selectedLanguage, setSearchParams])

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
      showSemanticSearch={showSemanticSearch}
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
          ? `/repos/${repoPath}/files/refs/heads/${branch}/~/${encodeResourcePath(filePath)}?keyword=${encodeURIComponent(searchQuery)}`
          : // TODO: get default branch
            `/repos/${repoRef}/files/refs/heads/main/~/${encodeResourcePath(filePath)}?keyword=${encodeURIComponent(searchQuery)}`
      }
      toRepo={({ repoPath }) => `/repos/${repoPath}`}
      // language filter props
      selectedLanguage={selectedLanguage}
      onLanguageSelect={language => {
        setSelectedLanguage(language)
      }}
      // repo filter props
      repoOptions={repoOptions}
      selectedRepoId={selectedRepoId}
      onRepoSelect={(repoName: string) => {
        setSelectedRepoId(repoName)
      }}
      onRecursiveToggle={(recursive: boolean) => {
        setIsRecursive(recursive)
      }}
      onClearFilters={handleClearFilters}
    />
  )
}
