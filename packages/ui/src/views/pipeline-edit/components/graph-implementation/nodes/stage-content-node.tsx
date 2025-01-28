import { PipelineNodes } from '@components/pipeline-nodes'

import { SerialNodeInternalType } from '@harnessio/pipeline-graph'

import { StageNodeContextMenu } from '../context-menu/stage-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/PipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'

export interface StageContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function StageContentNode(props: {
  node: SerialNodeInternalType<StageContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
}) {
  const { node, children, collapsed } = props
  const data = node.data as StageContentNodeDataType

  const { showContextMenu, onAddIntention } = usePipelineStudioNodeContext()

  return (
    <PipelineNodes.StageNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      onAddClick={() => {
        onAddIntention(data, 'in')
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StageNodeContextMenu, data, e.currentTarget)
      }}
    >
      {children}
    </PipelineNodes.StageNode>
  )
}
