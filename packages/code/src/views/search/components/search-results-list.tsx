import { FC, useState } from 'react'

import { Accordion, Alert, Button, IconV2, Layout, Link, NoData, Skeleton, Tag } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

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
  onClearFilters: () => void
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
  toRepo,
  onClearFilters
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

    if (isDirtyList) {
      return (
        <NoData
          withBorder
          imageName="no-search-magnifying-glass"
          title={t('views:noData.noResults', 'No search results')}
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          secondaryButton={{
            icon: 'trash',
            label: t('views:noData.clearFilters', 'Clear filters'),
            onClick: onClearFilters
          }}
        />
      )
    }

    return (
      <NoData
        imageName="no-search-magnifying-glass"
        title={t('views:search.emptyState.title', 'Start searching')}
        description={[t('views:search.emptyState.description', 'Enter search terms to find relevant results,')]}
      />
    )
  }

  const getItemPath = (item: SearchResultItem) => `${item.repo_path}/${item.file_name}`

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
        <Accordion.Trigger className="gap-cn-xs px-cn-sm py-cn-xs" headerClassName="bg-cn-2">
          <Layout.Horizontal className="w-full" gap="sm">
            {!isRepoScope ? (
              <Link noHoverUnderline variant="secondary" to={toRepo({ repoPath: item.repo_path })}>
                <Tag value={item.repo_path} icon="repository" />
              </Link>
            ) : null}
            <Link
              variant="secondary"
              to={toRepoFileDetails({ repoPath: item.repo_path, filePath: item.file_name, branch: item.repo_branch })}
            >
              {item.file_name}
            </Link>
          </Layout.Horizontal>
        </Accordion.Trigger>
        <Accordion.Content className="border-cn-2 border-t pb-0" containerClassName="px-0">
          {item.matches && item.matches.length >= 1 && (
            <Layout.Vertical gap="none" className="mt-cn-3xs">
              {item.matches
                .slice(0, expandedItems[getItemPath(item)] ? undefined : DEFAULT_NUM_ITEMS_TO_SHOW)
                .map(match => (
                  <div
                    key={`${match.before}-${match.fragments.map(frag => frag.pre + frag.match + frag.post).join('')}-${match.after}`}
                    className="px-cn-md"
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
                <div className="bg-cn-0 mt-cn-2xs">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="outline-offset-cn-tight hover:!bg-[unset]"
                    onClick={() => {
                      const key = getItemPath(item)
                      setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
                    }}
                  >
                    <IconV2 name={expandedItems[getItemPath(item)] ? 'minus' : 'plus'} size="xs" />
                    {expandedItems[getItemPath(item)]
                      ? t('views:search.showLess', 'Show Less')
                      : t('views:search.showMore', 'Show {{matchesCount}} more matches', {
                          matchesCount: item.matches.length - DEFAULT_NUM_ITEMS_TO_SHOW
                        })}
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
    <Layout.Vertical gap="md">
      {results.map(item => (
        <AccordionContent key={getItemPath(item)} item={item} />
      ))}
    </Layout.Vertical>
  )
}
