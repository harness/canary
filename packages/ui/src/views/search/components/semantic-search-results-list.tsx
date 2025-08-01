import { FC, useState } from 'react'

import { Alert, Card, Layout, Link, SkeletonList, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { cn } from '@utils/cn'

export type SemanticSearchResultItem = {
  commit: string
  file_path: string
  start_line: number
  end_line: number
  file_name: string
  lines: string[]
}

const LINE_COUNT = 5

interface SemanticSearchResultsListProps {
  isLoading: boolean
  isDirtyList: boolean
  useSearchResultsStore: () => {
    semanticResults?: SemanticSearchResultItem[]
  }
  toRepoFileDetails: (params: { filePath: string }) => string
  semanticSearchError?: string
}

export const SemanticSearchResultsList: FC<SemanticSearchResultsListProps> = ({
  isLoading,
  isDirtyList,
  useSearchResultsStore,
  toRepoFileDetails,
  semanticSearchError
}) => {
  const { t } = useTranslation()
  const { semanticResults } = useSearchResultsStore()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return <SkeletonList />
  }

  if (!semanticResults?.length) {
    if (semanticSearchError) {
      return (
        <Alert.Root theme="danger">
          <Alert.Title>{semanticSearchError}</Alert.Title>
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
      {semanticResults.map(item => {
        const filePath = item.file_path
        const uniqueKey = `${filePath}-${item.start_line}-${item.end_line}`

        return (
          <Card.Root key={uniqueKey} tabIndex={0}>
            <Layout.Vertical gap="sm">
              <Link to={toRepoFileDetails({ filePath })}>
                <Text variant="body-strong">{item.file_name}</Text>
              </Link>

              <Layout.Vertical gap="sm">
                <div>
                  <pre className={cn('bg-cn-background-1 p-1 mt-1 rounded')}>
                    <code className="monospace">
                      {item.lines.slice(0, expandedItems[uniqueKey] ? undefined : LINE_COUNT).map((line, index) => {
                        const lineNumber = item.start_line + index
                        return (
                          <div key={`line-${lineNumber}`}>
                            {lineNumber} {line}
                          </div>
                        )
                      })}
                    </code>
                  </pre>
                </div>

                {item.lines.length > LINE_COUNT && (
                  <Text
                    variant="body-normal"
                    className="text-cn-primary cursor-pointer hover:underline"
                    onClick={() => {
                      setExpandedItems(prev => ({
                        ...prev,
                        [uniqueKey]: !prev[uniqueKey]
                      }))
                    }}
                  >
                    {expandedItems[uniqueKey]
                      ? t('views:search.showLess', '- Show Less')
                      : t('views:search.showMore', `+ Show More`)}
                  </Text>
                )}
              </Layout.Vertical>
            </Layout.Vertical>
          </Card.Root>
        )
      })}
    </Layout.Vertical>
  )
}
