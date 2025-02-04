import React from 'react'

import { ExecutionState } from '@views/repo/pull-request'

import { ExecutionStatus } from './execution-status'

export const PipelineStatus = ({
  status,
  buildTime,
  createdTime
}: {
  status: ExecutionState
  buildTime: string
  createdTime: string
}) => {
  return (
    <div className="flex justify-between border-b px-6 pb-4 pt-3">
      <div className="flex flex-col">
        <span className="text-foreground-5">Status</span>
        <ExecutionStatus.Badge status={status} />
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

export default PipelineStatus
