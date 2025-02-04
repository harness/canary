import React from 'react'

export const PipelineStatus = ({
  status,
  buildTime,
  createdTime
}: {
  status: string
  buildTime: string
  createdTime: string
}) => {
  return (
    <div className="flex justify-between px-2 py-4 border-b">
      <div className="flex flex-col">
        <span className="text-foreground-5">Status</span>
        <span className="text-primary">{status}</span>
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
