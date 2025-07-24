import { FC, useState } from 'react'

import { Card, Layout, Link, SkeletonList, Spacer, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

interface SearchResultsListProps {
  isLoading: boolean
  isDirtyList: boolean
  useSearchResultsStore: () => {
    results?: SearchResultItem[]
  }
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
  toRepoFileDetails
}) => {
  const { t } = useTranslation()
  const { results } = useSearchResultsStore()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return <SkeletonList />
  }

  if (!results?.length) {
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
        <Card.Root key={`${item.repo_path}/${item.file_name}`} tabIndex={0}>
          <Layout.Vertical gap="sm">
            <Layout.Horizontal gap="xs">
              <Tag value={item.repo_path} icon="repository" showIcon={true} size={'sm'} />
              <Link
                to={toRepoFileDetails({ repoPath: item.repo_path, filePath: item.file_name, branch: item.repo_branch })}
              >
                <Text variant="body-strong">{item.file_name}</Text>
              </Link>
            </Layout.Horizontal>

            {item.matches && item.matches.length > 1 && (
              <Layout.Vertical gap="sm">
                {item.matches
                  .slice(0, expandedItems[`${item.repo_path}/${item.file_name}`] ? undefined : 3)
                  .map(match => (
                    <div
                      key={`${match.before}-${match.fragments.map(frag => frag.pre + frag.match + frag.post).join('')}-${match.after}`}
                    >
                      <pre className={cn('bg-cn-background-1 p-1 mt-1 rounded')}>
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
                {item.matches?.length > 3 && (
                  <Text
                    variant="body-normal"
                    className="text-cn-primary cursor-pointer hover:underline"
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
                      : t('views:search.showMore', `+${item.matches.length - 3} more`)}
                  </Text>
                )}
              </Layout.Vertical>
            )}
          </Layout.Vertical>
        </Card.Root>
      ))}
    </Layout.Vertical>
  )
}
