import { useCallback, useState } from 'react'

import { SearchPageView } from '@harnessio/views'

import { searchResultsStore } from './search-results-store'

export const SearchPagePreview = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [regexEnabled, setRegexEnabled] = useState(false)
  const [semanticEnabled, setSemanticEnabled] = useState(false)
  const useSearchResultsStore = useCallback(() => searchResultsStore, [])

  return (
    <SearchPageView
      isLoading={false}
      toRepo={() => '#'}
      searchQuery={searchQuery}
      regexEnabled={regexEnabled}
      setRegexEnabled={setRegexEnabled}
      showSemanticSearch={true}
      semanticEnabled={semanticEnabled}
      setSemanticEnabled={setSemanticEnabled}
      setSearchQuery={setSearchQuery}
      useSearchResultsStore={useSearchResultsStore}
      toRepoFileDetails={() => '#'}
      onRepoSelect={() => {}}
      onLanguageSelect={() => {}}
      onClearFilters={() => {}}
      isRepoScope={true}
      onRecursiveToggle={() => {}}
      scope={{ accountId: '1', orgIdentifier: '2', projectIdentifier: '3' }}
      stats={{ total_files: 4, total_matches: 10 }}
    />
  )
}
