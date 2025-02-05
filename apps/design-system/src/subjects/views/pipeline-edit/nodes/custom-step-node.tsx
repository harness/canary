import { useMemo } from 'react'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { CommonNodeDataType, usePipelineStudioNodeContext } from '@harnessio/ui/views'

import { StepNodeContextMenu } from '../context-menu/step-node-context-menu'
import { PipelineNodes } from '../pipeline-nodes'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'executing' | 'executed' | 'warning' | 'error'
  selected?: boolean
  warningMessage?: string
}

export function CustomStepContentNode(props: {
  node: LeafNodeInternalType<StepNodeDataType>
  isFirst?: boolean
  isLast?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
}) {
  const { node, isFirst, parentNodeType } = props
  const { data } = node

  const { selectionPath, showContextMenu, onSelectIntention, onAddIntention } = usePipelineStudioNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.StepNode
      name={data.name}
      icon={data.icon}
      selected={selected}
      isFirst={isFirst}
      parentNodeType={parentNodeType}
      nodeData={node.data}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StepNodeContextMenu, data, e.currentTarget)
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
