import React from 'react'
import { XmarkCircle, WarningTriangle, InfoCircle } from '@harnessio/icons-noir'

interface PipelineStudioFooterBarProps {
  problems: {
    error: number
    warning: number
    info: number
  }
  commitHistory: {
    lastCommittedAt: number
    lastCommittedBy: string
  }
  togglePane?: () => void
}

const PipelineStudioFooterBar: React.FC<PipelineStudioFooterBarProps> = (props: PipelineStudioFooterBarProps) => {
  const lastCommittedAt = props.commitHistory.lastCommittedAt
  const lastCommittedBy = props.commitHistory.lastCommittedBy
  return (
    <footer
      className={
        'flex items-center justify-between font-normal leading-[15px] px-4 h-10 bg-grey-6 shrink-0 border-border border-t text-grey-60 not-italic border-[#1d1d20] text-[12px]'
      }>
      <div className="flex gap-2 items-center">
        <div
          onClick={() => {
            props.togglePane?.()
          }}
          className="flex gap-2 cursor-pointer hover:bg-primary/10 h-full px-2 py-1.5 rounded-md ease-in-out duration-150">
          <div className="flex items-center gap-1.5">
            <XmarkCircle className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{props.problems.error}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <WarningTriangle className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{props.problems.warning}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <InfoCircle className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{props.problems.info}</span>
          </div>
        </div>
        {/* <div className={'flex gap-2'}>
          <div className="flex gap-1 items-center">
            <span className="text-tertiary-background text-[12px]">Repository:</span>
            <Select defaultValue="harness-next">
              <SelectTrigger className="w-fit border-none px-1 text-primary text-[12px] focus:ring-[0px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harness-next">harness-next</SelectItem>
                <SelectItem value="canary">canary</SelectItem>
                <SelectItem value="devops">devops</SelectItem>
                <SelectItem value="unscripted">unscripted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={'flex items-baseline'}>
            <span className="text-tertiary-background text-[12px]">Branch:</span>
            <Select defaultValue="main">
              <SelectTrigger className="w-fit border-none px-1 text-primary text-[12px] focus:ring-[0px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">main</SelectItem>
                <SelectItem value="develop">develop</SelectItem>
                <SelectItem value="release">release</SelectItem>
                <SelectItem value="feature">feature</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}
      </div>
      {lastCommittedAt && lastCommittedBy && (
        <div className="flex text-[12px] text-tertiary-background">
          Last edited
          <span className="text-primary">&nbsp;{lastCommittedAt}&nbsp;</span> by
          <span className="text-primary">&nbsp;{lastCommittedBy}&nbsp;</span>
        </div>
      )}
    </footer>
  )
}

export { PipelineStudioFooterBar }
