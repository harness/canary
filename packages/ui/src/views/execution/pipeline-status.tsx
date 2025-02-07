import { ExecutionState } from '@views/repo/pull-request'

import { ExecutionStatus } from './execution-status'

const PipelineStatus = ({
  status,
  buildTime,
  createdTime,
  commit,
  branch
}: {
  status: ExecutionState
  buildTime: string
  createdTime: string
  commit: string
  branch: string
}) => {
  return (
    <div className="flex justify-between gap-11">
      <div className="flex flex-col gap-1.5">
        <span className="text-foreground-4 leading-tight">Commit</span>
        <span className="text-foreground-1">{commit}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-foreground-4 leading-tight">Branch</span>
        <span className="text-foreground-1">{branch}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-foreground-4 leading-tight">Status</span>
        <ExecutionStatus.Badge status={status} minimal />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-foreground-4 leading-tight">Build time</span>
        <span className="text-tag-foreground-amber-1">{buildTime}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-foreground-4 leading-tight">Created</span>
        <span className="text-foreground-1">{createdTime}</span>
      </div>
    </div>
  )
}

export { PipelineStatus }
