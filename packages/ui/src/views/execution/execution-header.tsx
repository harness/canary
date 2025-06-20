import { FC } from 'react'

import { IconV2, Text } from '@/components'
import { cn } from '@utils/cn'
import { ExecutionState } from '@views/repo/pull-request'

import { PipelineStatus } from './pipeline-status'

interface ExecutionHeaderProps {
  commitName: string
  branchName: string
  title: { number?: string; title: string }
  storage?: string
  storageAverage?: string
  simpleOperation?: string
  advancedOperations?: string
  dataTransfer?: string
  branch?: string
  commit?: string
  status: ExecutionState
  buildTime: string
  createdTime?: string
  startedTime?: string
  delegateType?: string
  pipelineName: string
  className?: string
}

export const ExecutionHeader: FC<ExecutionHeaderProps> = ({
  title,
  storage,
  storageAverage,
  simpleOperation,
  advancedOperations,
  dataTransfer,
  branch,
  commit,
  status,
  buildTime,
  createdTime,
  startedTime,
  delegateType,
  className
}) => {
  return (
    <div className={cn('px-6 py-5', className)}>
      <div className="flex flex-col gap-[18px]">
        <Text as="h1" variant="heading-subsection" className="max-w-[600px]">
          {title.number && <span className="text-cn-foreground-2">#{title.number} </span>}
          <span className="text-cn-foreground-1">{title.title}</span>
        </Text>
      </div>

      <div className="text-2 mt-6 flex w-full flex-wrap items-center justify-between gap-6 leading-none">
        <PipelineStatus
          branch={branch}
          commit={commit}
          status={status}
          buildTime={buildTime}
          createdTime={createdTime}
          startedTime={startedTime}
          delegateType={delegateType}
        />
        <div className="flex h-full items-end gap-11">
          {storage && (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-2 leading-tight">Storage</span>
              <span className="text-cn-foreground-1">{storage}</span>
            </div>
          )}
          {storageAverage && (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-2 leading-tight">Storage (average)</span>
              <span className="text-cn-foreground-1 inline-flex gap-x-1.5">
                {storageAverage} <span className="border-icons-7 size-3.5 rounded-full border" />
              </span>
            </div>
          )}
          {simpleOperation && (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-2 leading-tight">Simple Operation</span>
              <span className="text-cn-foreground-1 inline-flex gap-x-1.5">
                {simpleOperation}
                <IconV2 className="text-icons-7" name="circle-with-sector" size="xs" />
              </span>
            </div>
          )}
          {advancedOperations && (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-2 leading-tight">Advanced Operations</span>
              <span className="text-cn-foreground-1 inline-flex gap-x-1.5">
                {advancedOperations}
                <IconV2 className="text-icons-7" name="circle-with-sector" size="xs" />
              </span>
            </div>
          )}
          {dataTransfer && (
            <div className="flex flex-col gap-1.5">
              <span className="text-cn-foreground-2 leading-tight">Data Transfer</span>
              <span className="text-cn-foreground-1 inline-flex gap-x-1.5">
                {dataTransfer}
                <IconV2 className="text-icons-7" name="circle-with-sector" size="xs" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
