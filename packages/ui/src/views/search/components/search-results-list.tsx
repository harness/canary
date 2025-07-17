import { FC } from 'react'

import { Button, Text } from '@/components'
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
            variant: 'heading-section',
            color: 'foreground-1'
          }}
          className={cn('mb-2')}
        >
          {isDirtyList
            ? t('views:search.noResultsFound', 'No search results found')
            : t('views:search.startSearching', 'Start searching')}
        </Text>
        <Text
          {...{
            variant: 'body-normal',
            color: 'foreground-2'
          }}
          className={cn('mb-6')}
        >
          {isDirtyList
            ? t('views:search.tryDifferentQuery', 'Try a different search query or clear filters')
            : t('views:search.enterSearchTerms', 'Enter search terms to find relevant results')}
        </Text>
        {isDirtyList && (
          <Button onClick={onResetFiltersAndPages}>{t('views:search.clearSearch', 'Clear search')}</Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4')}>
      {results.map(item => (
        <button
          key={item.id}
          className={cn('cursor-pointer border border-border-1 p-4 rounded-md text-left hover:bg-cn-background-2')}
          onClick={() => onItemClick?.(item)}
          onKeyDown={e => e.key === 'Enter' && onItemClick?.(item)}
        >
          {item.type && <div className={cn('mb-1 text-xs text-cn-foreground-2')}>{item.type}</div>}
          <div className={cn('font-medium text-base text-cn-foreground-1')}>{item.title}</div>
          {item.description && <div className={cn('mt-1 text-sm text-cn-foreground-2')}>{item.description}</div>}
        </button>
      ))}
    </div>
  )
}
