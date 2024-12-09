import { Tooltip, TooltipContent, TooltipTrigger } from '@harnessio/canary'
import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { CommonNodeDataType } from '../types/nodes'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'loading'
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const data = node.data as StepNodeDataType

  return (
    <div className="-z-10 box-border size-full rounded-xl border border-borders-6 bg-primary-foreground">
      <div>{data?.icon}</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="m-2 line-clamp-2 cursor-default text-primary">{data.name}</div>
        </TooltipTrigger>
        <TooltipContent>{data.name}</TooltipContent>
      </Tooltip>
    </div>
  )
}
