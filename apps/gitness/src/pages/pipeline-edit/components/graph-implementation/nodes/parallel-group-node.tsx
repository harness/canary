import { Tooltip, TooltipContent, TooltipTrigger } from '@harnessio/canary'
import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'

import { CommonNodeDataType } from '../types/nodes'

export interface ParallelGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function ParallelGroupContentNode(props: {
  node: ParallelNodeInternalType<ParallelGroupContentNodeDataType>
  children: React.ReactElement
}) {
  const { node, children } = props
  const data = node.data as ParallelGroupContentNodeDataType

  console.log(node)
  return (
    <>
      <div className="absolute inset-0 -z-10 rounded-xl border border-dashed border-borders-6"></div>
      <div className="absolute inset-0 flex h-9 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="m-3 h-9 cursor-default truncate pl-8 pt-2.5 text-primary-muted">{data.name}</div>
          </TooltipTrigger>
          <TooltipContent>{data.name}</TooltipContent>
        </Tooltip>
      </div>
      {children}
    </>
  )
}
