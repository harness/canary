import { useMemo } from 'react'

import { PipelineNodes } from '@components/pipeline-nodes'
import { CollapsedGroupNode } from '@components/pipeline-nodes/components/collapsed-group-node'

import { SerialNodeInternalType } from '@harnessio/pipeline-graph'

import { StageFloatingAddNodeContextMenu } from '../context-menu/stage-floating-add-node-context-menu'
import { StageNodeContextMenu } from '../context-menu/stage-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'
import { getNestedStepsCount } from '../utils/common-step-utils'

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

  const {
    selectionPath,
    showContextMenu,
    onAddIntention,
    onSelectIntention,
    parallelContainerConfig,
    serialContainerConfig
  } = usePipelineStudioNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  const allChildrenCount = getNestedStepsCount(node.children)

  return (
    <PipelineNodes.StageNode
      allChildrenCount={allChildrenCount}
      collapsed={collapsed}
      name={data.name}
      isEmpty={node.children.length === 0}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      serialContainerConfig={serialContainerConfig}
      parallelContainerConfig={parallelContainerConfig}
      onAddInClick={() => {
        onAddIntention(data, 'in')
      }}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu({ contextMenu: StageNodeContextMenu, nodeData: data, initiator: e.currentTarget })
      }}
      onHeaderClick={e => {
        e.stopPropagation()
        onSelectIntention(data)
      }}
      onAddClick={(position, e) => {
        showContextMenu({
          contextMenu: StageFloatingAddNodeContextMenu,
          nodeData: data,
          initiator: e.currentTarget,
          isOutside: true,
          outsidePosition: position
        })
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
    </PipelineNodes.StageNode>
  )
}
