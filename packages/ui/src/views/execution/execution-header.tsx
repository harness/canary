import { Breadcrumb, Icon, Text } from '@/components'
import { ExecutionState } from '@views/repo/pull-request'

import { PipelineStatus } from './pipeline-status'

interface ExecutionHeaderProps {
  commitName: string
  branchName: string
  title: { number: string; title: string }
  storage: string
  storageAverage: string
  simpleOperation: string
  advancedOperations: string
  dataTransfer: string
  branch: string
  commit: string
  status: ExecutionState
  buildTime: string
  createdTime: string
  pipelineName: string
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({
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
  createdTime
}) => {
  return (
    <div className="px-6 py-5">
      <div className="flex flex-col gap-[18px]">
        <h1 className="text-18 max-w-[600px] font-medium leading-snug">
          <span className="text-foreground-4">#{title.number} </span>
          <span className="text-foreground-1">{title.title}</span>
        </h1>
      </div>

      <div className="text-14 mt-6 flex w-full flex-wrap items-center justify-between gap-6 leading-none">
        <PipelineStatus
          branch={branch}
          commit={commit}
          status={status}
          buildTime={buildTime}
          createdTime={createdTime}
        />
        <div className="flex h-full items-end gap-11">
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground-4 leading-tight">Storage</span>
            <span className="text-foreground-1">{storage}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground-4 leading-tight">Storage (average)</span>
            <span className="text-foreground-1 inline-flex gap-x-1.5">
              {storageAverage} <span className="border-icons-7 size-3.5 rounded-full border" />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground-4 leading-tight">Simple Operation</span>
            <span className="text-foreground-1 inline-flex gap-x-1.5">
              {simpleOperation}
              <Icon className="text-icons-7" name="circle-with-sector" size={14} />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground-4 leading-tight">Advanced Operations</span>
            <span className="text-foreground-1 inline-flex gap-x-1.5">
              {advancedOperations}
              <Icon className="text-icons-7" name="circle-with-sector" size={14} />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-foreground-4 leading-tight">Data Transfer</span>
            <span className="text-foreground-1 inline-flex gap-x-1.5">
              {dataTransfer}
              <Icon className="text-icons-7" name="circle-with-sector" size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
