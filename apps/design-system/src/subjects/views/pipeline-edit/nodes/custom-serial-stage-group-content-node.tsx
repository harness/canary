import { useMemo } from 'react'

import { SerialNodeInternalType } from '@harnessio/pipeline-graph'
import { CommonNodeDataType, usePipelineStudioNodeContext } from '@harnessio/ui/views'

import { StageGroupAddInNodeContextMenu } from '../context-menu/stage-group-add-in-node-context-menu'
import { StageGroupNodeContextMenu } from '../context-menu/stage-group-node-context-menu'
import { PipelineNodes } from '../pipeline-nodes'

export interface CustomSerialStageGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function CustomSerialStageGroupContentNode(props: {
  node: SerialNodeInternalType<CustomSerialStageGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as CustomSerialStageGroupContentNodeDataType

  const { selectionPath, showContextMenu, onSelectIntention, onAddIntention } = usePipelineStudioNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.SerialGroupNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      nodeData={data}
      onAddInClick={e => {
        e.stopPropagation()
        showContextMenu(StageGroupAddInNodeContextMenu, data, e.currentTarget, true)
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StageGroupNodeContextMenu, data, e.currentTarget)
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
    </PipelineNodes.SerialGroupNode>
  )
}
