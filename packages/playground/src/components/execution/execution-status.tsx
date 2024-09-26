import React from 'react'
import { Refresh, Xmark } from '@harnessio/icons-noir' // TODO: Lose these!
import { Icon as CanaryIcon } from '@harnessio/canary'

export enum ExecutionState {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ERROR = 'error',
  SKIPPED = 'skipped',
  KILLED = 'killed'
}

interface ExecutionStatusProps {
  status: ExecutionState
}

interface BadgeProps {
  duration: string
  minimal?: boolean
}

const Badge: React.FC<ExecutionStatusProps & BadgeProps> = props => {
  const { status, duration, minimal } = props
  switch (status) {
    case ExecutionState.RUNNING:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-studio-3 rounded-full" />
          <span className="text-studio-3">Running</span>
        </div>
      ) : (
        <div className="flex gap-1 items-center border-solid border border-studio-3/[0.12] px-1 py-0.5 rounded-md bg-studio-3/10">
          <div className="flex gap-1 items-center">
            <Refresh color="rgba(226,155,54,1)" size="16" className="animate-spin" />
            <span className="text-studio-3">Running</span>
          </div>
          {duration && <span className="text-studio-3">{duration}</span>}
        </div>
      )
    case ExecutionState.ERROR:
    case ExecutionState.FAILURE:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#ED5E5E] rounded-full" />
          <span className="text-[#ED5E5E]">Failed</span>
        </div>
      ) : (
        <div className="flex gap-1 items-center border-solid border border-[#F76E6E1F] pr-1 py-[2px] rounded-md bg-[#F76E6E1A]/[0.1]">
          <div className="flex gap-0.5 items-center">
            <Xmark color="#ED5E5E" size="20" />
            <span className="text-[#ED5E5E]">Failed</span>
          </div>
          {duration && <span className="text-[#ED5E5E]">{duration}</span>}
        </div>
      )
    case ExecutionState.SUCCESS:
      return minimal ? (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-success">Success</span>
        </div>
      ) : (
        /**@TODO add else condition as well*/ <></>
      )
    default:
      return <></>
  }
}

const Icon: React.FC<ExecutionStatusProps> = props => {
  const { status } = props

  switch (status) {
    case ExecutionState.FAILURE:
    case ExecutionState.ERROR:
      return <CanaryIcon size={16} name="fail" />
    case ExecutionState.SUCCESS:
      return <CanaryIcon size={16} name="success" />
    case ExecutionState.RUNNING:
      return <CanaryIcon size={16} name="running" className="animate-spin text-warning rounded-full" />
    default:
      return <></>
  }
}

export const ExecutionStatus = { Badge, Icon }
