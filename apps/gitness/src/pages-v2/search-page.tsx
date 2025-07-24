import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import { useListReposQuery } from '@harnessio/code-service-client'
import { SearchPageView, SearchResultItem } from '@harnessio/ui/views'

import { useMFEContext } from '../framework/hooks/useMFEContext'
import { useQueryState } from '../framework/hooks/useQueryState'
import { useAPIPath } from '../hooks/useAPIPath'
import { transformRepoList } from './repo/transform-utils/repo-list-transform'

interface Stats {
  total_files: number
  total_matches: number
}

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
  const [regexEnabled, setRegexEnabled] = useState(false)
  const [semanticEnabled, setSemanticEnabled] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
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

  const { mutate, isLoading } = useMutation<TData, TError, TVariables>({
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

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      mutate({ query: searchQuery })
    }
  }, [searchQuery, mutate, regexEnabled, selectedRepoId, selectedLanguage])

  const handleRepoSelect = (repoName: string) => {
    setSelectedRepoId(repoName)
  }

  return (
    <SearchPageView
      isLoading={isLoading}
      searchQuery={searchQuery}
      setSearchQuery={q => q && setSearchQuery(q)}
      regexEnabled={regexEnabled}
      setRegexEnabled={setRegexEnabled}
      semanticEnabled={semanticEnabled}
      setSemanticEnabled={setSemanticEnabled}
      repos={repos ? transformRepoList(repos) : undefined}
      selectedRepoId={selectedRepoId}
      isReposListLoading={isReposListLoading}
      onClearFilters={() => {
        setSelectedRepoId(null)
        setSelectedLanguage(null)
      }}
      stats={stats}
      selectedLanguage={selectedLanguage}
      onLanguageSelect={language => {
        setSelectedLanguage(language)
      }}
      useSearchResultsStore={() => {
        return {
          results: searchResults,
          page: 1,
          xNextPage: 0,
          xPrevPage: 0,
          setPage: () => {},
          setPaginationFromHeaders: () => {}
        }
      }}
      toRepoFileDetails={({ repoPath, filePath, branch }) =>
        `/repos/${repoPath}/code/refs/heads/${branch}/~/${filePath}`
      }
      onRepoSelect={handleRepoSelect}
    />
  )
}
