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
    <div className="flex justify-between gap-12">
      <div className="flex flex-col">
        <span className="text-foreground-5">Commit</span>
        <span className="text-primary">{commit}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Branch</span>
        <span className="text-primary">{branch}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Status</span>
        <ExecutionStatus.Badge status={status} minimal />
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Build time</span>
        <span className="text-primary">{buildTime}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Created</span>
        <span className="text-primary">{createdTime}</span>
      </div>
    </div>
  )
}

export { PipelineStatus }
