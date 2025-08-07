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

import { CommitTitleWithPRLink } from './CommitTitleWithPRLink'

type CommitsGroupedByDate = Record<string, TypesCommit[]>

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toPullRequest?: ({ pullRequestId }: { pullRequestId: number }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
interface CommitProps extends Partial<RoutingProps> {
  data?: TypesCommit[]
  className?: string
}

export const CommitsList: FC<CommitProps> = ({ data, toCommitDetails, toPullRequest, toCode, className }) => {
  const { Link } = useRouterContext()

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

  return (
    <div className={className}>
      {entries.map(([date, commitData]) => (
        <NodeGroup.Root className="grid-cols-[9px_1fr] gap-4 pb-cn-xl last:pb-0" key={date}>
          <NodeGroup.Icon simpleNodeIcon />
          <NodeGroup.Title>{date && <Text variant="body-single-line-normal">Commits on {date}</Text>}</NodeGroup.Title>
          <NodeGroup.Content className="overflow-hidden">
            {!!commitData.length && (
              <StackedList.Root>
                {commitData.map((commit, idx) => {
                  const authorName = commit.author?.identity?.name
                  const avatarUrl = commit.author?.identity?.avatarUrl
                  const when = commit.committer?.when ?? ''

                  return (
                    <StackedList.Item
                      className="flex items-start p-cn-sm pl-cn-xs"
                      key={commit?.sha || idx}
                      isLast={commitData.length - 1 === idx}
                      asChild
                    >
                      <Link className="grow overflow-hidden" to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}>
                        <Layout.Grid flow="column" className="w-full pl-cn-md" columns="1fr auto" gap="md">
                          <Layout.Vertical gap="2xs" className="truncate">
                            <CommitTitleWithPRLink
                              toPullRequest={toPullRequest}
                              commitMessage={commit.title}
                              title={commit.message || commit.title}
                              textVariant={'heading-base'}
                            />
                            <div className="flex items-center gap-cn-2xs">
                              {authorName && <Avatar name={authorName} src={avatarUrl} size="md" rounded />}
                              <Text variant="body-single-line-strong">{authorName || ''}</Text>
                              <Text variant="body-single-line-normal" color="foreground-3">
                                committed on{' '}
                                <TimeAgoCard
                                  timestamp={when}
                                  dateTimeFormatOptions={{ dateStyle: 'medium' }}
                                  textProps={{ color: 'foreground-4' }}
                                />
                              </Text>
                            </div>
                          </Layout.Vertical>

                          {!!commit?.sha && (
                            <Layout.Horizontal gap="xs" align="center">
                              <CommitCopyActions sha={commit.sha} toCommitDetails={toCommitDetails} size="sm" />
                              <Button
                                title="View repository at this point of history"
                                variant="outline"
                                size="sm"
                                asChild
                                iconOnly
                              >
                                <Link to={toCode?.({ sha: commit?.sha || '' }) || ''}>
                                  <IconV2 name="code" />
                                </Link>
                              </Button>
                            </Layout.Horizontal>
                          )}
                        </Layout.Grid>
                      </Link>
                    </StackedList.Item>
                  )
                })}
              </StackedList.Root>
            )}
          </NodeGroup.Content>
          <NodeGroup.Connector />
        </NodeGroup.Root>
      ))}
    </div>
  )
}
