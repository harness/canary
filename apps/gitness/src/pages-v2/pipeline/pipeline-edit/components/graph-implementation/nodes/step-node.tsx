import { useMemo } from 'react'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'loading'
  selected?: boolean
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const data = node.data

  const { showContextMenu, selectionPath } = useNodeContext()

  const selected = useMemo(() => selectionPath === data.yamlPath, [selectionPath])

  return (
    <PipelineNodes.StepNode
      name={data.name}
      icon={data.icon}
      onEllipsisClick={e => {
        e.stopPropagation()
        showContextMenu(data, e.currentTarget)
      }}
      selected={selected}
    ></PipelineNodes.StepNode>
  )
}
