import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

import { StageGroupAddInNodeContextMenu } from '../context-menu/stage-group-add-in-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/PipelineStudioNodeContext'
import { CommonNodeDataType } from '../types/common-node-data-type'

export interface AddNodeDataType extends CommonNodeDataType {}

export function AddNode(props: { node: LeafNodeInternalType<AddNodeDataType> }) {
  const { node } = props
  const { data } = node

  const { showContextMenu } = usePipelineStudioNodeContext()

  return (
    <PipelineNodes.AddNode
      onClick={e => {
        e.stopPropagation()
        showContextMenu(StageGroupAddInNodeContextMenu, data, e.currentTarget)
      }}
    />
  )
}
