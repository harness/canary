import React, { FC, useMemo } from 'react'

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
        <NodeGroup.Root className="grid-cols-[4px_1fr] gap-4 pb-6 last:pb-0" key={date}>
          <NodeGroup.Icon simpleNodeIcon />
          <NodeGroup.Title>
            {date && (
              <Text variant="body-single-line-normal" color="foreground-3">
                Commits on {date}
              </Text>
            )}
          </NodeGroup.Title>
          <NodeGroup.Content className="overflow-hidden">
            {!!commitData.length && (
              <StackedList.Root>
                {commitData.map((commit, repo_idx) => {
                  const authorName = commit.author?.identity?.name
                  const avatarUrl = commit.author?.identity?.avatarUrl
                  const when = commit.committer?.when ?? ''

                  return (
                    <StackedList.Item
                      className="flex !cursor-default items-start p-cn-sm pl-cn-xs"
                      key={commit?.sha || repo_idx}
                      isLast={commitData.length - 1 === repo_idx}
                    >
                      <Layout.Horizontal className="w-full pl-cn-md">
                        <Link
                          className="grow overflow-hidden"
                          onClick={e => {
                            e.stopPropagation()
                          }}
                          key={commit?.sha}
                          to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}
                        >
                          <Layout.Vertical gap="2xs">
                            {renderCommitTitle({
                              commitMessage: commit.title,
                              title: commit.message || commit.title,
                              sha: commit.sha,
                              Link,
                              toPullRequest,
                              toCommitDetails
                            })}
                            <div className="flex items-center gap-x-1.5">
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
                        </Link>
                        {!!commit?.sha && (
                          <Layout.Horizontal gap="sm" align="center">
                            <CommitCopyActions sha={commit.sha} toCommitDetails={toCommitDetails} />
                            <Button
                              title="View repository at this point of history"
                              variant="outline"
                              size="sm"
                              iconOnly
                              onClick={() => {
                                navigate(toCode?.({ sha: commit?.sha || '' }) || '')
                              }}
                            >
                              <IconV2 name="code" />
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

function renderCommitLink({
  commitMessage = '',
  title = '',
  sha = '',
  toCommitDetails,
  Link
}: {
  commitMessage?: string
  title?: string
  sha?: string
  toCommitDetails: RoutingProps['toCommitDetails']
  Link: React.ComponentType<LinkProps>
}) {
  return (
    <Link
      className="flex overflow-hidden text-sm font-medium leading-snug hover:underline"
      to={`${toCommitDetails?.({ sha })}`}
    >
      <Text variant="heading-base" truncate title={title}>
        {commitMessage}
      </Text>
    </Link>
  )
}

function renderCommitTitle({
  commitMessage = '',
  title = '',
  sha = '',
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
      const peaces = commitMessage.split(match[0])
      const peacesEls = peaces.map(peace => {
        return renderCommitLink({
          commitMessage: peace,
          title,
          sha,
          toCommitDetails,
          Link
        })
      })
      peacesEls.splice(
        1,
        0,
        <Text variant="heading-base">
          <Layout.Flex>
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

      return <Layout.Flex>{peacesEls}</Layout.Flex>
    }
  }

  return renderCommitLink({
    commitMessage,
    title,
    sha,
    toCommitDetails,
    Link
  })
}
