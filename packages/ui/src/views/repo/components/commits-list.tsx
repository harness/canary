import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, CommitCopyActions, NodeGroup, StackedList } from '@/components'
import { formatDate, getInitials } from '@/utils/utils'
import { TypesCommit } from '@/views'

type CommitsGroupedByDate = Record<string, TypesCommit[]>

interface CommitProps {
  data?: TypesCommit[]
}

export const CommitsList: FC<CommitProps> = ({ data }) => {
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
    <div>
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
                    <Link to={`${commit?.sha?.substring(0, 7)}`} key={commit?.sha}>
                      <StackedList.Item
                        className="items-start py-3"
                        key={commit?.sha || repo_idx}
                        isLast={commitData.length - 1 === repo_idx}
                      >
                        <StackedList.Field
                          title={
                            <div className="flex flex-col gap-y-1.5">
                              <span className="truncate text-16 font-medium leading-snug">{commit.title}</span>
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
                        {!!commit?.sha && (
                          <StackedList.Field title={<CommitCopyActions sha={commit.sha} />} right label secondary />
                        )}
                      </StackedList.Item>
                    </Link>
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
