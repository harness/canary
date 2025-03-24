import { useMemo } from 'react'

import { PipelineNodes } from '@components/pipeline-nodes'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { GlobalData } from '../../../types/common-types'
import { StepNodeContextMenu } from '../context-menu/step-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/UnifiedPipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'executing' | 'executed' | 'warning' | 'error'
  selected?: boolean
  warningMessage?: string
}

export function StepContentNode(props: {
  node: LeafNodeInternalType<StepNodeDataType>
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
    onAddIntention,
    globalData,
    serialContainerConfig,
    parallelContainerConfig
  } = usePipelineStudioNodeContext<GlobalData>()

  const { hideContextMenu, hideFloatingButtons } = globalData ?? {}

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.StepNode
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
        showContextMenu({ contextMenu: StepNodeContextMenu, nodeData: data, initiator: e.currentTarget })
      }}
      onClick={e => {
        e.stopPropagation()
        onSelectIntention(data)
      }}
      onAddClick={position => {
        onAddIntention(data, position)
      }}
    />
  )
}
