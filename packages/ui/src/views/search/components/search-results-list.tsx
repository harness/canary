import { FC } from 'react'

import { Button, Card, Layout, Link, SkeletonList, Spacer, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

interface SearchResultsListProps {
  isLoading: boolean
  isDirtyList: boolean
  useSearchResultsStore: () => {
    results: SearchResultItem[]
  }
  clearSearch: () => void
  toRepoFileDetails: (params: { repoPath: string; filePath: string; branch: string }) => string
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
  useSearchResultsStore,
  toRepoFileDetails,
  clearSearch
}) => {
  const { t } = useTranslation()
  const { results } = useSearchResultsStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!results.length) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12')}>
        <Text variant="heading-section">
          {isDirtyList
            ? t('views:search.noResultsFound', 'No search results found')
            : t('views:search.startSearching', 'Start searching')}
        </Text>
        <Spacer size={2} />
        <Text variant="body-normal">
          {isDirtyList
            ? t('views:search.tryDifferentQuery', 'Try a different search query or clear filters')
            : t('views:search.enterSearchTerms', 'Enter search terms to find relevant results')}
        </Text>
        <Spacer size={4} />
        {isDirtyList && <Button onClick={clearSearch}>{t('views:search.clearSearch', 'Clear search')}</Button>}
      </div>
    )
  }

  return (
    <Layout.Vertical gap="md">
      {results.map(item => (
        <Card.Root key={`${item.repo_path}/${item.file_name}`} tabIndex={0}>
          <Layout.Vertical gap="sm">
            <Layout.Horizontal gap="sm">
              <Tag value={item.repo_path} icon="repository" />
              <Link
                to={toRepoFileDetails({ repoPath: item.repo_path, filePath: item.file_name, branch: item.repo_branch })}
              >
                <Text variant="body-strong">{item.file_name}</Text>
              </Link>
            </Layout.Horizontal>

            {item.matches && item.matches.length > 1 && (
              <Layout.Vertical gap="sm">
                {item.matches.slice(0, 3).map((match, matchIndex) => (
                  <div key={`match-${matchIndex}`}>
                    <Text variant="body-normal">Line {match.line_num}</Text>
                    <pre className={cn('bg-cn-background-1 p-1 mt-1 overflow-x-scroll rounded')}>
                      <code>
                        {match.before}
                        {match.segments?.map((segment, segIndex) => (
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
                {item.matches?.length > 3 && <Text variant="body-normal">+{item.matches.length - 3} more</Text>}
              </Layout.Vertical>
            )}
          </Layout.Vertical>
        </Card.Root>
      ))}
    </Layout.Vertical>
  )
}
