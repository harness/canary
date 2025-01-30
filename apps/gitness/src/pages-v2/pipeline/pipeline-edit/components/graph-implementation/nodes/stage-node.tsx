import { SerialNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

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

  const { showContextMenu, handleAddIn } = useNodeContext()

  return (
    <PipelineNodes.StageNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      onAddClick={e => {
        handleAddIn(data, e.currentTarget)
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(data, e.currentTarget)
      }}
    >
      {children}
    </PipelineNodes.StageNode>
  )
}
