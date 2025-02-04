import { useMemo } from 'react'

import { SerialNodeInternalType } from '@harnessio/pipeline-graph'
import { CommonNodeDataType, usePipelineStudioNodeContext } from '@harnessio/ui/views'

import { StageNodeContextMenu } from '../context-menu/stage-node-context-menu'
import { PipelineNodes } from '../pipeline-nodes'

export interface CustomStageContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function CustomStageContentNode(props: {
  node: SerialNodeInternalType<CustomStageContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as CustomStageContentNodeDataType

  const { selectionPath, showContextMenu, onAddIntention, onSelectIntention } = usePipelineStudioNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.StageNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      nodeData={data}
      onAddInClick={() => {
        onAddIntention(data, 'in')
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StageNodeContextMenu, data, e.currentTarget)
      }}
      onHeaderClick={e => {
        e.stopPropagation()
        onSelectIntention(data)
      }}
      onAddClick={position => {
        onAddIntention(data, position)
      }}
    >
      {children}
    </PipelineNodes.StageNode>
  )
}
