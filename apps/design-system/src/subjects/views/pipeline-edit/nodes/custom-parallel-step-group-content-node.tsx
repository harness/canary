import { useMemo } from 'react'

import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'
import { CommonNodeDataType, usePipelineStudioNodeContext } from '@harnessio/ui/views'

import { StepGroupNodeContextMenu } from '../context-menu/step-group-node-context-menu'
import { PipelineNodes } from '../pipeline-nodes'
import { GlobalData } from '../types/common'

export interface CustomParallelStepGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function CustomParallelStepGroupContentNode(props: {
  node: ParallelNodeInternalType<CustomParallelStepGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as CustomParallelStepGroupContentNodeDataType

  const { selectionPath, showContextMenu, onSelectIntention, onAddIntention, globalData } =
    usePipelineStudioNodeContext<GlobalData>()

  const { hideContextMenu, hideFloatingButtons } = globalData ?? {}

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.ParallelGroupNode
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      node={node}
      hideContextMenu={hideContextMenu}
      hideFloatingButtons={hideFloatingButtons}
      onAddInClick={e => {
        e.stopPropagation()
        onAddIntention(data, 'in')
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StepGroupNodeContextMenu, data, e.currentTarget)
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
    </PipelineNodes.ParallelGroupNode>
  )
}
