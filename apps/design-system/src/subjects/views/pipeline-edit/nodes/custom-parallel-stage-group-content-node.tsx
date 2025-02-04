import { useMemo } from 'react'

import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'
import { CommonNodeDataType } from '@harnessio/ui/views'

import { StageGroupAddInNodeContextMenu } from '../context-menu/stage-group-add-in-node-context-menu'
import { StageGroupNodeContextMenu } from '../context-menu/stage-group-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/pipeline-studio-node-context'
import { PipelineNodes } from '../pipeline-nodes'

export interface CustomParallelStageGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function CustomParallelStageGroupContentNode(props: {
  node: ParallelNodeInternalType<CustomParallelStageGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as CustomParallelStageGroupContentNodeDataType

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
