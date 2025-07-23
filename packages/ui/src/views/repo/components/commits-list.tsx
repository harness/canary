import { FC, useMemo } from 'react'

import {
  Avatar,
  Button,
  CommitCopyActions,
  IconV2,
  Layout,
  NodeGroup,
  StackedList,
  Text,
  TimeAgoCard
} from '@/components'
import { useRouterContext } from '@/context'
import { formatDate } from '@/utils'
import { TypesCommit } from '@/views'

type CommitsGroupedByDate = Record<string, TypesCommit[]>

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
interface CommitProps extends Partial<RoutingProps> {
  data?: TypesCommit[]
  className?: string
}

export const CommitsList: FC<CommitProps> = ({ data, toCommitDetails, toCode, className }) => {
  const { Link, navigate } = useRouterContext()
  const entries = useMemo(() => {
    const commitsGroupedByDate = !data
      ? {}
      : data.reduce<CommitsGroupedByDate>((group, commit) => {
          const date = formatDate(commit.committer?.when ?? '')
          group[date] = (group[date] || []).concat(commit)
          return group
        }, {})

    return Object.entries(commitsGroupedByDate)
  }, [data])

  const totalNodes = entries.length

  return (
    <div className={className}>
      {entries.map(([date, commitData], node_idx) => (
        <NodeGroup.Root className="grid-cols-[4px_1fr] gap-x-[22px] gap-y-3.5 pb-6 last:pb-0" key={date}>
          <NodeGroup.Icon simpleNodeIcon />
          <NodeGroup.Title>{date && <span className="text-cn-foreground-4">Commits on {date}</span>}</NodeGroup.Title>
          <NodeGroup.Content className="overflow-hidden">
            {!!commitData.length && (
              <StackedList.Root>
                {commitData.map((commit, repo_idx) => {
                  const authorName = commit.author?.identity?.name
                  const avatarUrl = commit.author?.identity?.avatarUrl
                  const when = commit.committer?.when ?? ''

                  return (
                    <StackedList.Item
                      className="flex !cursor-default items-start py-3 pr-3"
                      key={commit?.sha || repo_idx}
                      isLast={commitData.length - 1 === repo_idx}
                    >
                      <Layout.Horizontal className="w-full truncate">
                        <Link
                          className="grow overflow-hidden"
                          onClick={e => {
                            e.stopPropagation()
                          }}
                          key={commit?.sha}
                          to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}
                        >
                          <Layout.Vertical>
                            {toCommitDetails ? (
                              <p>
                                <Link
                                  className="flex overflow-hidden text-sm font-medium leading-snug hover:underline"
                                  to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}
                                >
                                  <Text variant="heading-base" title={commit.message || commit.title} truncate>
                                    {commit.title}
                                  </Text>
                                </Link>
                              </p>
                            ) : (
                              <Text variant="heading-base" title={commit.message || commit.title} truncate>
                                {commit.title}
                              </Text>
                            )}
                            <div className="flex items-center gap-x-1.5">
                              {authorName && <Avatar name={authorName} src={avatarUrl} size="sm" rounded />}
                              <Text color="foreground-3">{authorName || ''}</Text>
                              <Text color="foreground-4">
                                committed on{' '}
                                <TimeAgoCard
                                  timestamp={when}
                                  dateTimeFormatOptions={{ dateStyle: 'medium' }}
                                  textProps={{ color: 'foreground-4' }}
                                />
                              </Text>
                            </div>
                          </Layout.Vertical>
                        </Link>
                        {!!commit?.sha && (
                          <Layout.Horizontal className="gap-2.5">
                            <CommitCopyActions sha={commit.sha} toCommitDetails={toCommitDetails} />
                            <Button
                              title="View repository at this point of history"
                              variant="outline"
                              size="xs"
                              iconOnly
                              onClick={() => {
                                navigate(toCode?.({ sha: commit?.sha || '' }) || '')
                              }}
                            >
                              <IconV2 name="code-brackets" />
                            </Button>
                          </Layout.Horizontal>
                        )}
                      </Layout.Horizontal>
                    </StackedList.Item>
                  )
                })}
              </StackedList.Root>
            )}
          </NodeGroup.Content>
          <NodeGroup.Connector first={node_idx === 0} last={node_idx === totalNodes - 1} className="!bottom-0 left-0" />
        </NodeGroup.Root>
      ))}
    </div>
  )
}
