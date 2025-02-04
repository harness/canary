import React from 'react'

export const PipelineStatus = () => {
  return (
    <div className="flex justify-between px-2 py-4">
      <div className="flex flex-col">
        <span className="text-foreground-5">Status</span>
        <span className="text-primary">Running</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Build time</span>
        <span className="text-primary">00 : 30</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground-5">Created</span>
        <span className="text-primary">10 mins ago</span>
      </div>
    </div>
  )
}

export default PipelineStatus
