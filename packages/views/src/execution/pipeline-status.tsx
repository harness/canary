import { ExecutionState } from '@views/repo/pull-request'

import { ExecutionStatus } from './execution-status'

const PipelineStatus = ({
  status,
  buildTime,
  createdTime,
  commit,
  branch,
  delegateType
}: {
  status: ExecutionState
  buildTime: string
  createdTime?: string
  commit?: string
  branch?: string
  startedTime?: string
  delegateType?: string
}) => {
  return (
    // TODO: Replace gap-[44px] with a proper value from design system when available
    <div className="flex justify-between gap-[44px]">
      {commit && (
        <div className="gap-cn-2xs flex flex-col">
          <span className="text-cn-2 leading-cn-16">Commit</span>
          <span className="text-cn-1">{commit}</span>
        </div>
      )}
      {branch && (
        <div className="gap-cn-2xs flex flex-col">
          <span className="text-cn-2 leading-cn-16">Branch</span>
          <span className="text-cn-1">{branch}</span>
        </div>
      )}
      <div className="gap-cn-2xs flex flex-col">
        <span className="text-cn-2 leading-cn-16">Status</span>
        <ExecutionStatus.Badge status={status} minimal />
      </div>
      <div className="gap-cn-2xs flex flex-col">
        <span className="text-cn-2 leading-cn-16">Build time</span>
        <span className="text-cn-1">{buildTime}</span>
      </div>
      <div className="gap-cn-2xs flex flex-col">
        <span className="text-cn-2 leading-cn-16">Created</span>
        <span className="text-cn-1">{createdTime}</span>
      </div>
      {delegateType && (
        <div className="gap-cn-2xs flex flex-col">
          <span className="text-cn-2 leading-cn-16">Delegate type</span>
          <span className="text-cn-1">{delegateType}</span>
        </div>
      )}
    </div>
  )
}

export { PipelineStatus }
