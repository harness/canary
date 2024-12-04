import { Icon, StackedList, Text } from '@harnessio/canary'

import { ExecutionStatus } from './execution/execution-status'
import { ExecutionState } from './execution/types'

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
    <div className="flex items-center gap-2">
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
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px]">
      {description && (
        <div className="w-full overflow-hidden break-words">
          <Text size={1} color="tertiaryBackground">
            {description || ''}
          </Text>
        </div>
      )}
      {sha && (
        <div className="bg-tertiary-background/10 flex items-center gap-1 rounded-md px-1.5 font-mono">
          <Icon size={11} name={'tube-sign'} />
          {sha}
        </div>
      )}
      {version && (
        <div className="flex items-center gap-1">
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
            <LinkComponent key={execution.id} to={execution.id}>
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
