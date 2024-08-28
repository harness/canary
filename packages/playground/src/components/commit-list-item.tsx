import React, { useEffect, useState } from 'react'
import { Icon, StackedList, Text } from '@harnessio/canary'
import copy from 'clipboard-copy'
import { TypesCommit } from './pull-request/interfaces'
interface CommitLineItemProps {
  header: string
  commitData: TypesCommit[]
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
      <div className="flex border rounded-lg py-0.5 px-2">
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

const CommitListItem = ({ header, commitData }: CommitLineItemProps) => {
  return (
    <div className="relative grid items-center grid-cols-[26px_1fr] grid-rows-[auto_1fr] gap-x-3 gap-y-2 pb-8">
      <div className="col-start-1 row-start-1">
        <div className="relative z-20 h-6 w-6 rounded-full flex place-content-center place-items-center p-1 border border-tertiary-background/30 bg-background text-primary">
          <Icon name="chaos-engineering" size={14} />
        </div>
      </div>
      <div className="col-start-2 row-start-1">
        {/* Ensure that header has at least one item */}
        {header && <div className="inline-flex gap-1.5 items-center">{`Commits on ${header}`}</div>}
      </div>
      <div className="col-start-2 row-start-2">
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
                        <Text className="pl-2 text-xs text-tertiary-background">{`${commit.author?.identity?.name} commited on ${header}`}</Text>
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
      </div>
      {<div className="z-10 absolute left-[12px] top-0 bottom-0 w-[1px] border-l" />}
    </div>
  )
}

export default CommitListItem
