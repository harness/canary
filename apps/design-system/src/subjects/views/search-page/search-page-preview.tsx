import { useCallback, useState } from 'react'

import { SearchPageView } from '@harnessio/ui/views'

import { searchResultsStore } from './search-results-store'

export const SearchPagePreview = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [regexEnabled, setRegexEnabled] = useState(false)
  const [semanticEnabled, setSemanticEnabled] = useState(false)
  const useSearchResultsStore = useCallback(() => searchResultsStore, [])

  return (
    <SearchPageView
      isLoading={false}
      searchQuery={searchQuery}
      regexEnabled={regexEnabled}
      setRegexEnabled={setRegexEnabled}
      semanticEnabled={semanticEnabled}
      setSemanticEnabled={setSemanticEnabled}
      setSearchQuery={setSearchQuery}
      useSearchResultsStore={useSearchResultsStore}
      toRepoFileDetails={() => '#'}
      onRepoSelect={() => {}}
      onLanguageSelect={() => {}}
      onClearFilters={() => {}}
      isProjectScope={false}
    />
  )
}
