import { FC } from 'react'

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
    <div className="flex justify-between gap-11">
      {commit && (
        <div className="flex flex-col gap-1.5">
          <span className="leading-tight text-foreground-4">Commit</span>
          <span className="text-foreground-1">{commit}</span>
        </div>
      )}
      {branch && (
        <div className="flex flex-col gap-1.5">
          <span className="leading-tight text-foreground-4">Branch</span>
          <span className="text-foreground-1">{branch}</span>
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <span className="leading-tight text-foreground-4">Status</span>
        <ExecutionStatus.Badge status={status} minimal />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="leading-tight text-foreground-4">Build time</span>
        <span className="text-foreground-1">{buildTime}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="leading-tight text-foreground-4">Created</span>
        <span className="text-foreground-1">{createdTime}</span>
      </div>
      {delegateType && (
        <div className="flex flex-col gap-1.5">
          <span className="leading-tight text-foreground-4">Delegate type</span>
          <span className="text-foreground-1">{delegateType}</span>
        </div>
      )}
    </div>
  )
}

export { PipelineStatus }
