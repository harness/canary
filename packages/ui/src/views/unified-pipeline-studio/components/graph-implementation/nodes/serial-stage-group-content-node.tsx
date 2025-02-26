import { useMemo } from 'react'

import { PipelineNodes } from '@components/pipeline-nodes'
import { CollapsedGroupNode } from '@components/pipeline-nodes/components/collapsed-group-node'

import { SerialNodeInternalType } from '@harnessio/pipeline-graph'

import { StageGroupAddInNodeContextMenu } from '../context-menu/stage-group-add-in-node-context-menu'
import { StageGroupNodeContextMenu } from '../context-menu/stage-group-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'
import { getNestedStepsCount } from '../utils/common-step-utils'

export interface SerialStageGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function SerialStageGroupContentNode(props: {
  node: SerialNodeInternalType<SerialStageGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as SerialStageGroupContentNodeDataType

  const {
    selectionPath,
    showContextMenu,
    onSelectIntention,
    onAddIntention,
    serialContainerConfig,
    parallelContainerConfig
  } = usePipelineStudioNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  const allChildrenCount = getNestedStepsCount(node.children)

  return (
    <PipelineNodes.SerialGroupNode
      allChildrenCount={allChildrenCount}
      executionStatus={data.executionStatus}
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      parallelContainerConfig={parallelContainerConfig}
      serialContainerConfig={serialContainerConfig}
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
      {collapsed ? (
        <CollapsedGroupNode
          node={node}
          containerNodeType={'serial'}
          parallelContainerConfig={parallelContainerConfig}
          serialContainerConfig={serialContainerConfig}
        />
      ) : (
        children
      )}
    </PipelineNodes.SerialGroupNode>
  )
}
