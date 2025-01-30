import { useMemo } from 'react'

import { PipelineNodes } from '@components/pipeline-nodes'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { StepNodeContextMenu } from '../context-menu/step-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/PipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'loading'
  selected?: boolean
}

export function StepContentNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props

  const data = node.data

  const { selectionPath, showContextMenu } = usePipelineStudioNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.StepNode
      name={data.name}
      icon={data.icon}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(StepNodeContextMenu, data, e.currentTarget)
      }}
      selected={selected}
    ></PipelineNodes.StepNode>
  )
}
