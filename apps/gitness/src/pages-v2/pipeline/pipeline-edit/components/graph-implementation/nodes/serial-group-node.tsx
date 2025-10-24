import { SerialNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

export interface SerialGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function SerialGroupContentNode(props: {
  node: SerialNodeInternalType<SerialGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
}) {
  const { node, children, collapsed } = props
  const data = node.data as SerialGroupContentNodeDataType

  const { showContextMenu, handleAddIn } = useNodeContext()

  return (
    <PipelineNodes.SerialGroupNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      onAddClick={(_position, e) => {
        handleAddIn(data, e.currentTarget)
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(data, e.currentTarget)
      }}
      onAddInClick={() => undefined}
      onHeaderClick={() => undefined}
    >
      {children}
    </PipelineNodes.SerialGroupNode>
  )
}
