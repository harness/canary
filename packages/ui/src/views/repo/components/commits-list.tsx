import { FC, useMemo } from 'react'

import {
  Avatar,
  Button,
  CommitCopyActions,
  IconV2,
  Layout,
  LinkProps,
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
        <NodeGroup.Root className="pb-cn-xl grid-cols-[9px_1fr] gap-4 last:pb-0" key={date}>
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
                      className="p-cn-sm pl-cn-xs flex items-start"
                      key={commit?.sha || idx}
                      isLast={commitData.length - 1 === idx}
                      asChild
                    >
                      <Link className="grow overflow-hidden" to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}>
                        <Layout.Grid flow="column" className="pl-cn-md w-full" columns="1fr auto" gap="md">
                          <Layout.Vertical gap="2xs" className="truncate">
                            {renderCommitTitle({
                              commitMessage: commit.title,
                              title: commit.message || commit.title,
                              sha: commit.sha,
                              Link,
                              toPullRequest,
                              toCommitDetails
                            })}
                            <div className="gap-cn-2xs flex items-center">
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

function renderCommitTitle({
  commitMessage = '',
  title = '',
  // sha = '',
  toPullRequest,
  toCommitDetails,
  Link
}: {
  commitMessage?: string
  title?: string
  sha?: string
  toCommitDetails: RoutingProps['toCommitDetails']
  toPullRequest: RoutingProps['toPullRequest']
  Link: React.ComponentType<LinkProps>
}) {
  if (!toCommitDetails) {
    return (
      <Text variant="heading-base" truncate title={title}>
        {commitMessage}
      </Text>
    )
  }

  const match = commitMessage.match(/\(#\d+\)(\n|$)/)

  if (match?.length && toPullRequest) {
    const pullRequestId = match[0].replace('(#', '').replace(')', '').replace('\n', '')
    const pullRequestIdInt = parseInt(pullRequestId)
    if (!isNaN(pullRequestIdInt)) {
      const pieces = commitMessage.split(match[0])
      const piecesEls = pieces.map(piece => {
        return (
          <Text variant="heading-base" truncate title={title} key={piece}>
            {piece}
          </Text>
        )
      })
      piecesEls.splice(
        1,
        0,
        <Text variant="heading-base">
          <Layout.Flex as="span">
            &nbsp;(
            <Link
              className="hover:underline"
              title={title}
              to={`${toPullRequest?.({ pullRequestId: pullRequestIdInt })}`}
            >
              #{pullRequestId}
            </Link>
            )&nbsp;
          </Layout.Flex>
        </Text>
      )

      return <Layout.Flex>{piecesEls}</Layout.Flex>
    }
  }

  return (
    <Text variant="heading-base" truncate title={title}>
      {commitMessage}
    </Text>
  )
}
