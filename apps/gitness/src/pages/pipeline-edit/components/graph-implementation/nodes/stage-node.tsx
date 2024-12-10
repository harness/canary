import { Tooltip, TooltipContent, TooltipTrigger } from '@harnessio/canary'
import { SerialNodeInternalType } from '@harnessio/pipeline-graph'

import { CommonNodeDataType } from '../types/nodes'

export interface StageNodeContentType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function SerialGroupNodeContent(props: {
  node: SerialNodeInternalType<StageNodeContentType>
  children: React.ReactElement
}) {
  const { node, children } = props
  const data = node.data as StageNodeContentType

  return (
    <>
      <div className="absolute inset-0 -z-10 border border-borders-6" />
      <div className="absolute inset-0 flex h-9 items-center bg-primary-foreground/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inset-0 m-3 h-9 cursor-default truncate pl-8 pt-2.5 text-primary-muted">{data.name}</div>
          </TooltipTrigger>
          <TooltipContent>{data.name}</TooltipContent>
        </Tooltip>
      </div>
      {children}
    </>
  )
}
