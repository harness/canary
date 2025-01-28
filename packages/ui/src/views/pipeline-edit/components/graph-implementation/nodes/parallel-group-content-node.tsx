import { PipelineNodes } from '@components/pipeline-nodes'

import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'

import { StageGroupAddInNodeContextMenu } from '../context-menu/stage-group-add-in-node-context-menu'
import { StageGroupNodeContextMenu } from '../context-menu/stage-group-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/PipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'

export interface ParallelGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function ParallelGroupContentNode(props: {
  node: ParallelNodeInternalType<ParallelGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
}) {
  const { node, children, collapsed } = props
  const data = node.data as ParallelGroupContentNodeDataType

  const { showContextMenu } = usePipelineStudioNodeContext()

  return (
    <PipelineNodes.SerialGroupNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      onAddClick={e => {
        e.stopPropagation()
        showContextMenu(StageGroupAddInNodeContextMenu, data, e.currentTarget, true)
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StageGroupNodeContextMenu, data, e.currentTarget)
      }}
    >
      {children}
    </PipelineNodes.SerialGroupNode>
  )
}
