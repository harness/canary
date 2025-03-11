import { useMemo } from 'react'

import { PipelineNodes } from '@components/pipeline-nodes'
import { CollapsedGroupNode } from '@components/pipeline-nodes/components/collapsed-group-node'

import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'

import { StepGroupNodeContextMenu } from '../context-menu/step-group-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'
import { getNestedStepsCount } from '../utils/common-step-utils'

export interface ParallelStepGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function ParallelStepGroupContentNode(props: {
  node: ParallelNodeInternalType<ParallelStepGroupContentNodeDataType>
  children?: React.ReactElement
  collapsed?: boolean
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, children, collapsed, isFirst, parentNodeType } = props
  const data = node.data as ParallelStepGroupContentNodeDataType

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
        onAddIntention(data, 'in')
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu({
          contextMenu: StepGroupNodeContextMenu,
          nodeData: data,
          initiator: e.currentTarget
        })
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
