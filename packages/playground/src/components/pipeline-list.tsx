import { Icon, Meter, StackedList, Text } from '@harnessio/canary'

import { ExecutionStatus } from './execution/execution-status'
import type { ExecutionState } from './execution/types'

export enum MeterState {
  Empty = 0,
  Error = 1,
  Warning = 2,
  Success = 3
}

interface Pipeline {
  id: string
  status?: ExecutionState
  name?: string
  sha?: string
  description?: string
  version?: string
  timestamp?: string
  meter?: {
    id: string
    state: MeterState
  }[]
}

interface PageProps {
  pipelines?: Pipeline[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const Title = ({ status, title }: { status?: ExecutionState; title: string }) => {
  return (
    <div className="flex items-center gap-2">
      {status && <ExecutionStatus.Icon status={status} />}
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({ sha, description, version }: { sha: string; description: string; version: string }) => {
  return (
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px]">
      {sha && (
        <div className="flex items-center gap-1 rounded-md bg-tertiary-background/10 px-1.5">
          <Icon size={11} name={'tube-sign'} />
          {sha?.slice(0, 7)}
        </div>
      )}
      {description && (
        <div className="w-full overflow-hidden break-words">
          <Text size={1} color="tertiaryBackground">
            {description || ''}
          </Text>
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

export const PipelineList = ({ pipelines, LinkComponent }: PageProps) => {
  return (
    <>
      {pipelines && pipelines.length > 0 && (
        <StackedList.Root>
          {pipelines.map((pipeline, pipeline_idx) => (
            <LinkComponent key={pipeline.id} to={pipeline.id}>
              <StackedList.Item key={pipeline.name} isLast={pipelines.length - 1 === pipeline_idx}>
                <StackedList.Field
                  title={<Title status={pipeline.status} title={pipeline.name ?? ''} />}
                  description={
                    <Description
                      sha={pipeline.sha || ''}
                      description={pipeline.description || ''}
                      version={pipeline.version || ''}
                    />
                  }
                />
                <StackedList.Field
                  label
                  secondary
                  title={
                    pipeline.meter ? (
                      <Meter.Root data={pipeline.meter} />
                    ) : pipeline.timestamp ? (
                      `Created ${pipeline.timestamp}`
                    ) : (
                      ''
                    )
                  }
                  right
                />
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
