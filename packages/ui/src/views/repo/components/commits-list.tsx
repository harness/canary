import { FC, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, Button, CommitCopyActions, Icon, NodeGroup, StackedList } from '@/components'
import { formatDate, getInitials } from '@/utils/utils'
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
  const navigate = useNavigate()
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
          <NodeGroup.Title>{date && <span className="text-foreground-4">Commits on {date}</span>}</NodeGroup.Title>
          <NodeGroup.Content>
            {!!commitData.length && (
              <StackedList.Root>
                {commitData.map((commit, repo_idx) => {
                  const authorName = commit.author?.identity?.name

                  return (
                    <StackedList.Item
                      className="flex !cursor-default items-start py-3 pr-3"
                      key={commit?.sha || repo_idx}
                      isLast={commitData.length - 1 === repo_idx}
                    >
                      <Link
                        className="grow"
                        onClick={e => {
                          e.stopPropagation()
                        }}
                        key={commit?.sha}
                        to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}
                      >
                        <StackedList.Field
                          title={
                            <div className="flex w-full max-w-full flex-col gap-y-1.5">
                              {toCommitDetails ? (
                                <p>
                                  <Link
                                    className="text-16 font-medium leading-snug hover:underline"
                                    to={`${toCommitDetails?.({ sha: commit?.sha || '' })}`}
                                  >
                                    <span className="truncate">{commit.title}</span>
                                  </Link>
                                </p>
                              ) : (
                                <span className="text-16 truncate font-medium leading-snug">{commit.title}</span>
                              )}
                              <div className="flex items-center gap-x-1.5">
                                {authorName && (
                                  <Avatar className="size-[18px]">
                                    <AvatarFallback className="text-10">{getInitials(authorName)}</AvatarFallback>
                                  </Avatar>
                                )}
                                <span className="text-foreground-3">{authorName || ''}</span>
                                <span className="text-foreground-4">committed on {date}</span>
                              </div>
                            </div>
                          }
                        />
                      </Link>
                      {!!commit?.sha && (
                        <StackedList.Field
                          title={
                            <div className="flex gap-2.5">
                              <CommitCopyActions sha={commit.sha} toCommitDetails={toCommitDetails} />
                              <Button
                                className="hover:bg-background-3 border"
                                title="View repository at this point of history"
                                variant="custom"
                                size="sm_icon"
                                onClick={() => {
                                  navigate(toCode?.({ sha: commit?.sha || '' }) || '')
                                }}
                              >
                                <Icon name="code-brackets" className="text-icons-3" />
                              </Button>
                            </div>
                          }
                          right
                          label
                          secondary
                        />
                      )}
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
