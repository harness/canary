import { FC, KeyboardEvent } from 'react'

import { Button, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

interface SearchResultsListProps {
  isLoading: boolean
  isDirtyList: boolean
  onResetFiltersAndPages: () => void
  onItemClick?: (item: SearchResultItem) => void
  useSearchResultsStore: () => {
    results: SearchResultItem[]
  }
}

export interface SearchResultItem {
  file_name: string
  repo_path: string
  repo_branch: string
  language: string
  matches: Array<{
    line_num: number
    before: string
    after: string
    segments: Array<{
      pre: string
      match: string
      post: string
    }>
  }>
}

export const SearchResultsList: FC<SearchResultsListProps> = ({
  isLoading,
  isDirtyList,
  onResetFiltersAndPages,
  onItemClick,
  useSearchResultsStore
}) => {
  const { t } = useTranslation()
  const { results } = useSearchResultsStore()

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-48')}>
        <div className={cn('size-8 animate-spin rounded-full border-4 border-border-1 border-t-transparent')} />
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12')}>
        <Text
          {...{
            variant: "heading-section",
            color: "foreground-1"
          }}
        >
          {isDirtyList
            ? t('views:search.noResultsFound', 'No search results found')
            : t('views:search.startSearching', 'Start searching')}
        </Text>
        <Spacer size={2} />
        <Text
          {...{
            variant: "body-normal",
            color: "foreground-2"
          }}
        >
          {isDirtyList
            ? t('views:search.tryDifferentQuery', 'Try a different search query or clear filters')
            : t('views:search.enterSearchTerms', 'Enter search terms to find relevant results')}
        </Text>
        <Spacer size={4} />
        {isDirtyList && (
          <Button onClick={onResetFiltersAndPages}>{t('views:search.clearSearch', 'Clear search')}</Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4')}>
      {results.map((item, index) => (
        <div
          key={`${item.file_name}-${index}`}
          onClick={() => onItemClick?.(item)}
          onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onItemClick?.(item)}
          className={cn('cursor-pointer border border-border-1 p-4 rounded-md hover:bg-cn-background-2')}
          tabIndex={0}
          role="button"
          aria-label={`Search result for ${item.file_name}`}
        >
          <div className={cn('mb-2 flex flex-wrap gap-2 items-center')}>
            <Text {...{ variant: "body-strong" }}>{item.file_name}</Text>
            <Text {...{ variant: "body-normal", color: "foreground-2" }}>{item.repo_path}</Text>
            <Text {...{ variant: "body-normal", color: "foreground-2" }}>{item.repo_branch}</Text>
            <Text {...{ variant: "body-normal", color: "foreground-3" }}>{item.language}</Text>
          </div>
          
          {item.matches.map((match, matchIndex) => (
            <div key={`match-${matchIndex}`} className={cn('mt-2')}>
              <Text {...{ variant: "body-normal", color: "foreground-2" }}>Line {match.line_num}</Text>
              <pre className={cn('bg-cn-background-1 p-2 mt-1 overflow-x-auto rounded')}>
                <code>
                  {match.before}
                  {match.segments.map((segment, segIndex) => (
                    <span key={`seg-${segIndex}`}>
                      {segment.pre}
                      <span className={cn('bg-yellow-100/30')}>{segment.match}</span>
                      {segment.post}
                    </span>
                  ))}
                  {match.after}
                </code>
              </pre>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
