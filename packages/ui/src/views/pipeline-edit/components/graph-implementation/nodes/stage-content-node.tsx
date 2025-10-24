import { useMemo } from 'react'

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
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as StageContentNodeDataType

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
