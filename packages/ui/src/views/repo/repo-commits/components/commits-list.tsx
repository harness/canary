import { useMemo } from 'react'

import { Avatar, AvatarFallback, CommitCopyActions, NodeGroup, StackedList, Text } from '@/components'
import { formatDate, getInitials } from '@/utils/utils'

import { TypesCommit } from '../types'

interface CommitProps {
  data?: TypesCommit[]
}

export const CommitsList = ({ ...props }: CommitProps) => {
  const data = props.data
  const commitsGroupedByDate: Record<string, TypesCommit[]> = useMemo(
    () =>
      data?.reduce(
        (group, commit) => {
          const date = formatDate(commit.committer?.when as string)
          group[date] = (group[date] || []).concat(commit)
          return group
        },
        {} as Record<string, TypesCommit[]>
      ) || {},
    [data]
  )

  const entries = Object.entries(commitsGroupedByDate)
  const totalNodes = entries.length

  return (
    <>
      {entries.map(([date, commitData], node_idx) => (
        <NodeGroup.Root key={date}>
          <NodeGroup.Icon simpleNodeIcon />
          <NodeGroup.Title>{date && <Text color="tertiaryBackground">Commits on {date}</Text>}</NodeGroup.Title>
          <NodeGroup.Content>
            {commitData && commitData.length > 0 && (
              <StackedList.Root>
                {commitData.map((commit, repo_idx) => {
                  const authorName = commit.author?.identity?.name

                  return (
                    <StackedList.Item
                      className="hover:bg-transparent"
                      key={commit.title}
                      isLast={commitData.length - 1 === repo_idx}
                    >
                      <StackedList.Field
                        title={
                          <div className="flex flex-col">
                            <div className="max-w-[500px] truncate">{commit.title}</div>
                            <div className="flex items-center pt-1">
                              {authorName && (
                                <div className="bg-tertiary-background h-5 w-5 rounded-full bg-cover">
                                  <Avatar className="h-5 w-5 rounded-full p-0">
                                    <AvatarFallback>
                                      <Text size={1} color="tertiaryBackground">
                                        {getInitials(authorName)}
                                      </Text>
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              )}
                              <Text className="text-tertiary-background pl-2 text-xs">{`${authorName || ''} commited on ${date}`}</Text>
                            </div>
                          </div>
                        }
                      />
                      {commit?.sha && (
                        <StackedList.Field title={<CommitCopyActions sha={commit.sha} />} right label secondary />
                      )}
                    </StackedList.Item>
                  )
                })}
              </StackedList.Root>
            )}
          </NodeGroup.Content>
          <NodeGroup.Connector first={node_idx === 0} last={node_idx === totalNodes - 1} />
        </NodeGroup.Root>
      ))}
    </>
  )
}
