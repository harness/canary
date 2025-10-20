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
    <div className={cn('px-cn-xl py-cn-lg', className)}>
      <div className="flex flex-col gap-[18px]">
        <Text as="h1" variant="heading-subsection" className="max-w-[600px]">
          {title.number && <span className="text-cn-2">#{title.number} </span>}
          <span className="text-cn-1">{title.title}</span>
        </Text>
      </div>

      <div className="mt-cn-xl flex w-full flex-wrap items-center justify-between gap-cn-xl text-2 leading-none">
        <PipelineStatus
          branch={branch}
          commit={commit}
          status={status}
          buildTime={buildTime}
          createdTime={createdTime}
          startedTime={startedTime}
          delegateType={delegateType}
        />
        {/* Replace gap-[44px] with a proper value from design system when available */}
        <div className="flex h-full items-end gap-[44px]">
          {storage && (
            <div className="flex flex-col gap-cn-2xs">
              <span className="leading-tight text-cn-2">Storage</span>
              <span className="text-cn-1">{storage}</span>
            </div>
          )}
          {storageAverage && (
            <div className="flex flex-col gap-cn-2xs">
              <span className="leading-tight text-cn-2">Storage (average)</span>
              <span className="inline-flex gap-x-cn-2xs text-cn-1">
                {storageAverage} <span className="size-3.5 rounded-full border border-cn-2" />
              </span>
            </div>
          )}
          {simpleOperation && (
            <div className="flex flex-col gap-cn-2xs">
              <span className="leading-tight text-cn-2">Simple Operation</span>
              <span className="inline-flex gap-x-cn-2xs text-cn-1">
                {simpleOperation}
                <IconV2 className="text-cn-2" name="circle-with-sector" size="xs" />
              </span>
            </div>
          )}
          {advancedOperations && (
            <div className="flex flex-col gap-cn-2xs">
              <span className="leading-tight text-cn-2">Advanced Operations</span>
              <span className="inline-flex gap-x-cn-2xs text-cn-1">
                {advancedOperations}
                <IconV2 className="text-cn-2" name="circle-with-sector" size="xs" />
              </span>
            </div>
          )}
          {dataTransfer && (
            <div className="flex flex-col gap-cn-2xs">
              <span className="leading-tight text-cn-2">Data Transfer</span>
              <span className="inline-flex gap-x-cn-2xs text-cn-1">
                {dataTransfer}
                <IconV2 className="text-cn-2" name="circle-with-sector" size="xs" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
