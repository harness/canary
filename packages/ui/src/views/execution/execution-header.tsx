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

      <div className="mt-cn-xl gap-cn-xl flex w-full flex-wrap items-center justify-between">
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
            <div className="gap-cn-2xs flex flex-col">
              <Text as="span">Storage</Text>
              <Text as="span" color="foreground-1">
                {storage}
              </Text>
            </div>
          )}
          {storageAverage && (
            <div className="gap-cn-2xs flex flex-col">
              <Text as="span">Storage (average)</Text>
              <Text as="span" color="foreground-1" className="gap-x-cn-2xs inline-flex">
                {storageAverage} <span className="border-cn-2 size-3.5 rounded-cn-full border" />
              </Text>
            </div>
          )}
          {simpleOperation && (
            <div className="gap-cn-2xs flex flex-col">
              <Text as="span">Simple Operation</Text>
              <Text as="span" color="foreground-1" className="gap-x-cn-2xs inline-flex">
                {simpleOperation}
                <IconV2 className="text-cn-2" name="circle-with-sector" size="xs" />
              </Text>
            </div>
          )}
          {advancedOperations && (
            <div className="gap-cn-2xs flex flex-col">
              <Text as="span">Advanced Operations</Text>
              <Text as="span" color="foreground-1" className="gap-x-cn-2xs inline-flex">
                {advancedOperations}
                <IconV2 className="text-cn-2" name="circle-with-sector" size="xs" />
              </Text>
            </div>
          )}
          {dataTransfer && (
            <div className="gap-cn-2xs flex flex-col">
              <Text as="span">Data Transfer</Text>
              <Text as="span" color="foreground-1" className="gap-x-cn-2xs inline-flex">
                {dataTransfer}
                <IconV2 className="text-cn-2" name="circle-with-sector" size="xs" />
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
