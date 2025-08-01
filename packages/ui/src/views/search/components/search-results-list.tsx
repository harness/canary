import { FC, useState } from 'react'

import { Alert, Card, Layout, Link, SkeletonList, Spacer, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

const DEFAULT_NUM_ITEMS_TO_SHOW = 1

interface SearchResultsListProps {
  isLoading: boolean
  isDirtyList: boolean
  useSearchResultsStore: () => {
    results?: SearchResultItem[]
  }
  toRepoFileDetails: (params: { repoPath: string; filePath: string; branch: string }) => string
  searchError?: string
  isRepoScope: boolean
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
    fragments: Array<{
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
  searchError,
  isRepoScope
}) => {
  const { t } = useTranslation()
  const { results } = useSearchResultsStore()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return <SkeletonList />
  }

  if (!results?.length) {
    // Display error message if there's a search error
    if (searchError) {
      return (
        <Alert.Root theme="danger">
          <Alert.Title>{searchError}</Alert.Title>
        </Alert.Root>
      )
    }

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
      </div>
    )
  }

  return (
    <Layout.Vertical gap="md">
      {results.map(item => (
        <Card.Root key={`${item.repo_path}/${item.file_name}`} tabIndex={0} wrapperClassname="!p-0">
          <Card.Content>
            <Layout.Horizontal
              gap="xs"
              className={cn('p-4', { 'border-b border-cn-border-2': item.matches && item.matches.length > 1 })}
            >
              {!isRepoScope ? <Tag value={item.repo_path} icon="repository" showIcon={true} size={'sm'} /> : null}
              <Link
                to={toRepoFileDetails({
                  repoPath: item.repo_path,
                  filePath: item.file_name,
                  branch: item.repo_branch
                })}
              >
                <Text variant="body-strong">{item.file_name}</Text>
              </Link>
            </Layout.Horizontal>

            {item.matches && item.matches.length > 1 && (
              <Layout.Vertical gap="none">
                {item.matches
                  .slice(
                    0,
                    expandedItems[`${item.repo_path}/${item.file_name}`] ? undefined : DEFAULT_NUM_ITEMS_TO_SHOW
                  )
                  .map(match => (
                    <div
                      key={`${match.before}-${match.fragments.map(frag => frag.pre + frag.match + frag.post).join('')}-${match.after}`}
                    >
                      <pre className={cn('bg-cn-background-1 px-4 py-1 border-b border-cn-border-2')}>
                        <code className="monospace">
                          {match.before.trim().length > 0 && (
                            <>
                              {match.line_num - 1} {match.before}
                              <br />
                            </>
                          )}
                          {match.line_num}{' '}
                          {match.fragments?.map((segment, segIndex) => (
                            <span key={`seg-${segIndex}`}>
                              {segment.pre}
                              <mark>{segment.match}</mark>
                              {segment.post}
                            </span>
                          ))}
                          {match.after.trim().length > 0 && (
                            <>
                              <br />
                              {match.line_num + 1} {match.after}
                            </>
                          )}
                        </code>
                      </pre>
                    </div>
                  ))}
                {item.matches?.length > DEFAULT_NUM_ITEMS_TO_SHOW && (
                  <Text
                    variant="body-normal"
                    className="text-cn-primary cursor-pointer px-4 py-2 hover:underline"
                    onClick={() => {
                      const key = `${item.repo_path}/${item.file_name}`
                      setExpandedItems(prev => ({
                        ...prev,
                        [key]: !prev[key]
                      }))
                    }}
                  >
                    {expandedItems[`${item.repo_path}/${item.file_name}`]
                      ? t('views:search.showLess', '- Show Less')
                      : t(
                          'views:search.showMore',
                          `+ Show ${item.matches.length - DEFAULT_NUM_ITEMS_TO_SHOW} more matches`
                        )}
                  </Text>
                )}
              </Layout.Vertical>
            )}
          </Card.Content>
        </Card.Root>
      ))}
    </Layout.Vertical>
  )
}
