import { Icon, StackedList, Text } from '@harnessio/canary'
import React from 'react'
import { ExecutionState } from './execution/types'
import { ExecutionStatus } from './execution/execution-status'

export interface Execution {
  id: string
  status: ExecutionState
  name?: string
  sha?: string
  description?: string | React.ReactElement
  version?: string
  timestamp: string
  lastTimestamp: string
}

interface PageProps {
  executions?: Execution[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const Title = ({ status, title }: { status: ExecutionState; title: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <ExecutionStatus.Icon status={status} />
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({
  sha,
  description,
  version
}: {
  sha: string
  description: string | React.ReactElement
  version: string
}) => {
  return (
    <div className="pl-[24px] inline-flex gap-2 items-center max-w-full overflow-hidden">
      {description && (
        <div className="break-words w-full overflow-hidden">
          <Text size={1} color="tertiaryBackground">
            {description || ''}
          </Text>
        </div>
      )}
      {sha && (
        <div className="px-1.5 rounded-md flex gap-1 items-center bg-tertiary-background/10 font-mono">
          <Icon size={11} name={'tube-sign'} />
          {sha}
        </div>
      )}
      {version && (
        <div className="flex gap-1 items-center">
          <Icon size={11} name={'signpost'} />
          {version}
        </div>
      )}
    </div>
  )
}

export const ExecutionList = ({ executions, LinkComponent }: PageProps) => {
  return (
    <>
      {executions && executions.length > 0 && (
        <StackedList.Root>
          {executions.map((execution, execution_idx) => (
            <LinkComponent to={execution.id}>
              <StackedList.Item key={execution.name} isLast={executions.length - 1 === execution_idx}>
                <StackedList.Field
                  title={<Title status={execution.status} title={execution.name || ''} />}
                  description={
                    <Description
                      sha={execution.sha || ''}
                      description={execution.description || ''}
                      version={execution.version || ''}
                    />
                  }
                />
                <StackedList.Field
                  title={execution.timestamp}
                  description={execution.lastTimestamp}
                  right
                  label
                  secondary
                />
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
