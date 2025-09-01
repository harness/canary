import { FC, useMemo } from 'react'

import {
  Avatar,
  Button,
  CommitCopyActions,
  IconV2,
  Layout,
  Link,
  NodeGroup,
  StackedList,
  Text,
  TimeAgoCard
} from '@/components'
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
        <NodeGroup.Root className="pb-cn-xl grid-cols-[9px_1fr] gap-4 last:pb-0" key={date}>
          <NodeGroup.Icon simpleNodeIcon />
          <NodeGroup.Title>{date && <Text variant="body-single-line-normal">Commits on {date}</Text>}</NodeGroup.Title>
          <NodeGroup.Content>
            {!!commitData.length && (
              <StackedList.Root>
                {commitData.map((commit, idx) => {
                  const authorName = commit.author?.identity?.name
                  const avatarUrl = commit.author?.identity?.avatarUrl
                  const when = commit.committer?.when ?? ''

                  return (
                    <StackedList.Item
                      className="items-start"
                      paddingY="sm"
                      key={commit?.sha || idx}
                      to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}
                    >
                      <Layout.Grid flow="column" className="w-full" columns="1fr auto" gap="md">
                        <Layout.Vertical gap="2xs" className="truncate">
                          <CommitTitleWithPRLink
                            toPullRequest={toPullRequest}
                            commitMessage={commit.title}
                            title={commit.message || commit.title}
                            textProps={{ variant: 'heading-base' }}
                          />
                          <div className="gap-cn-2xs flex items-center">
                            {authorName && <Avatar name={authorName} src={avatarUrl} size="md" rounded />}
                            <Text variant="body-single-line-strong">{authorName || ''}</Text>
                            <Text variant="body-single-line-normal" color="foreground-3">
                              committed{' '}
                              <TimeAgoCard
                                timestamp={when}
                                cutoffDays={3}
                                beforeCutoffPrefix=""
                                afterCutoffPrefix="on"
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
