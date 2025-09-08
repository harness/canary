import { FC, useState } from 'react'

import { Accordion, Alert, Button, Layout, Link, Skeleton, Spacer, Tag, Text } from '@/components'
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
  toRepo: (params: { repoPath?: string }) => string
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
  isRepoScope,
  toRepo
}) => {
  const { t } = useTranslation()
  const { results } = useSearchResultsStore()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return <Skeleton.List />
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

  const AccordionContent = ({ item }: { item: SearchResultItem }) => (
    <Accordion.Root
      type="multiple"
      indicatorPosition="left"
      size="sm"
      variant="card"
      cardSize="sm"
      defaultValue={[item.file_name]}
      disabled={item.matches.length === 0}
    >
      <Accordion.Item value={item.file_name}>
        <Accordion.Trigger className="gap-4 px-4 py-3">
          <Layout.Horizontal className="w-full" gap="md">
            {!isRepoScope ? (
              <Link noHoverUnderline variant="secondary" to={toRepo({ repoPath: item.repo_path })}>
                <Tag value={item.repo_path} icon="repository" />
              </Link>
            ) : null}
            <Link
              variant="secondary"
              to={toRepoFileDetails({
                repoPath: item.repo_path,
                filePath: item.file_name,
                branch: item.repo_branch
              })}
            >
              <Text variant="body-strong">{item.file_name}</Text>
            </Link>
          </Layout.Horizontal>
        </Accordion.Trigger>
        <Accordion.Content className="border-t bg-cn-1 pb-0">
          {item.matches && item.matches.length >= 1 && (
            <Layout.Vertical gap="none" className="mt-1">
              {item.matches
                .slice(0, expandedItems[`${item.repo_path}/${item.file_name}`] ? undefined : DEFAULT_NUM_ITEMS_TO_SHOW)
                .map(match => (
                  <div
                    key={`${match.before}-${match.fragments.map(frag => frag.pre + frag.match + frag.post).join('')}-${match.after}`}
                    className="px-4"
                  >
                    <pre className={cn('bg-cn-1')}>
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
                <div className="bg-cn-0 mt-2 py-1.5 pl-4">
                  <Button
                    variant="link"
                    className="text-cn-2 font-caption-single-line-normal p-cn-4xs h-fit"
                    onClick={() => {
                      const key = `${item.repo_path}/${item.file_name}`
                      setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
                    }}
                  >
                    {expandedItems[`${item.repo_path}/${item.file_name}`]
                      ? t('views:search.showLess', '- Show Less')
                      : t(
                          'views:search.showMore',
                          `+ Show ${item.matches.length - DEFAULT_NUM_ITEMS_TO_SHOW} more matches`
                        )}
                  </Button>
                </div>
              )}
            </Layout.Vertical>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )

  return (
    <Layout.Vertical gap="xs">
      {results.map(item =>
        item.matches.length == 0 ? (
          <AccordionContent key={`${item.repo_path}/${item.file_name}`} item={item} />
        ) : (
          <AccordionContent key={`${item.repo_path}/${item.file_name}`} item={item} />
        )
      )}
    </Layout.Vertical>
  )
}
