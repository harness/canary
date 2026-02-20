import { useMemo } from 'react'

import { PipelineNodes } from '@harnessio/ui/components'
import { ExecutionStatusType } from '@harnessio/ui/components'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { GlobalData } from '../../../types/common-types'
import { StageFloatingAddNodeContextMenu } from '../context-menu/stage-floating-add-node-context-menu'
import { StageNodeContextMenu } from '../context-menu/stage-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'

export interface SplitView_StageContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: ExecutionStatusType
  warningMessage?: string
}

export function SplitView_StageContentNode(props: {
  node: LeafNodeInternalType<SplitView_StageContentNodeDataType>
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, isFirst, parentNodeType } = props
  const { data } = node

  const {
    selectionPath,
    showContextMenu,
    onSelectIntention,
    globalData,
    serialContainerConfig,
    parallelContainerConfig
  } = usePipelineStudioNodeContext<GlobalData>()

  const { hideContextMenu, hideFloatingButtons } = globalData ?? {}

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.SplitView_StageNode
      executionStatus={data.state}
      parallelContainerConfig={parallelContainerConfig}
      serialContainerConfig={serialContainerConfig}
      name={data.name}
      icon={data.icon}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      hideContextMenu={hideContextMenu}
      hideFloatingButtons={hideFloatingButtons}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu({ contextMenu: StageNodeContextMenu, nodeData: data, initiator: e.currentTarget })
      }}
      onClick={e => {
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
    />
  )
}
