import React, { useEffect, useMemo, useState } from 'react'
import { TypesCommit } from './interfaces'
import { formatDate } from '../../utils/utils'
import { Icon, StackedList, Text, NodeGroup } from '@harnessio/canary'
import copy from 'clipboard-copy'

interface CommitProps {
  data?: TypesCommit[]
}

interface CommitActionButtonProps {
  sha: string
  href: string
  enableCopy?: boolean
}

function CommitActions({ sha, enableCopy }: CommitActionButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let timeoutId: number
    if (copied) {
      timeoutId = window.setTimeout(() => setCopied(false), 2500)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [copied])

  return (
    <div>
      <div className="flex border rounded-lg py-0.5 px-2 items-center">
        {/* TODO: add link to commit details page */}
        {/* <Link to={href}> */}
        <Text className="text-tertiary-background">{sha.substring(0, 6)}</Text>
        {/* </Link> */}
        {enableCopy && (
          <div
            className="border-l ml-1 pl-1 pointer-events-auto"
            onClick={() => {
              setCopied(true)
              copy(sha)
            }}>
            {copied ? <Icon name="tick" /> : <Icon name="clone" className="text-tertiary-background" />}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PullRequestCommits({ ...props }: CommitProps) {
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

  return (
    <>
      {Object.entries(commitsGroupedByDate).map(([date, commitData]) => (
        <NodeGroup.Root>
          <NodeGroup.Icon>
            <Icon name="chaos-engineering" size={14} />
          </NodeGroup.Icon>
          <NodeGroup.Title>{date && <Text color="tertiaryBackground">Commits on {date}</Text>}</NodeGroup.Title>
          <NodeGroup.Content>
            {commitData && commitData.length > 0 && (
              <StackedList.Root className="pointer-events-none">
                {commitData.map((commit, repo_idx) => (
                  <StackedList.Item
                    className="pointer-events-none hover:bg-transparent"
                    key={commit.title}
                    isLast={commitData.length - 1 === repo_idx}>
                    <StackedList.Field
                      title={
                        <div className="flex flex-col">
                          <div className="truncate max-w-[500px]">{commit.title}</div>
                          <div className="flex items-center pt-1">
                            {/* TODO: fix avatar or use icon */}
                            <div className='h-5 w-5 rounded-full bg-tertiary-background bg-[url("../images/user-avatar.svg")] bg-cover'></div>
                            <Text className="pl-2 text-xs text-tertiary-background">{`${commit.author?.identity?.name} commited on ${date}`}</Text>
                          </div>
                        </div>
                      }
                    />
                    {commit?.sha && (
                      <StackedList.Field
                        title={<CommitActions sha={commit.sha} enableCopy href={''} />}
                        right
                        label
                        secondary
                      />
                    )}
                  </StackedList.Item>
                ))}
              </StackedList.Root>
            )}
          </NodeGroup.Content>
          <NodeGroup.Connector />
        </NodeGroup.Root>
      ))}
    </>
  )
}
