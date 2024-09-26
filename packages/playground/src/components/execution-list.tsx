import { Icon, StackedList, Text } from '@harnessio/canary'
import React from 'react'

export interface Execution {
  id: string
  success?: boolean
  name: string
  sha?: string
  description?: string
  version?: string
  timestamp: string
  lastTimestamp: string
}

interface PageProps {
  executions?: Execution[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const Title = ({ success, title }: { success?: boolean; title: string }) => {
  return (
    <div className="flex gap-2 items-center">
      {typeof success === 'boolean' ? (
        <Icon size={16} name={success ? 'success' : 'fail'} />
      ) : (
        <div className="w-4 h-4 rounded-full bg-primary/5 border border-muted border-dotted" />
      )}
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({ sha, description, version }: { sha: string; description: string; version: string }) => {
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
        <div className="px-1.5 rounded-md flex gap-1 items-center bg-tertiary-background/10">
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
                  title={<Title success={execution.success} title={execution.name} />}
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
