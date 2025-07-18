import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useMutation } from '@tanstack/react-query'

import { SearchPageView, SearchResultItem } from '@harnessio/ui/views'

import { useIsMFE } from '../framework/hooks/useIsMFE'
import { useMFEContext } from '../framework/hooks/useMFEContext'
import { useAPIPath } from '../hooks/useAPIPath'

interface TData {
  file_matches: SearchResultItem[]
}

interface TVariables {
  query: string
}

type TError = unknown

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [regex, setRegex] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const getApiPath = useAPIPath()
  const { scope } = useMFEContext()
  const isMfe = useIsMFE()
  const { spaceId } = useParams()

  const { mutate, isLoading } = useMutation<TData, TError, TVariables>({
    mutationFn: ({ query }) =>
      fetch(getApiPath('/api/v1/search'), {
        method: 'POST',
        body: JSON.stringify({
          repo_paths: [],
          space_paths: [[scope.accountId, scope.orgIdentifier, scope.projectIdentifier].join('/')],
          query: `( ${query} ) case:no`,
          max_result_count: 50,
          recursive: false,
          enable_regex: regex
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
    }
  })

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      mutate({ query: searchQuery })
    }
  }, [searchQuery, mutate, regex])

  return (
    <SearchPageView
      isLoading={isLoading}
      searchQuery={searchQuery}
      setSearchQuery={q => q && setSearchQuery(q)}
      regex={regex}
      setRegex={setRegex}
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
        isMfe
          ? `${window.apiUrl || ''}/repos/${repoPath}/code/${branch}/~/${filePath}`
          : `/${spaceId}/repos/${repoPath}/code/${branch}/~/${filePath}`
      }
    />
  )
}
