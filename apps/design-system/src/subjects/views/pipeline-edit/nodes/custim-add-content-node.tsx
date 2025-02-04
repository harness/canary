import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { CommonNodeDataType } from '@harnessio/ui/views'

import { StageGroupAddInNodeContextMenu } from '../context-menu/stage-group-add-in-node-context-menu'
import { usePipelineStudioNodeContext } from '../context/pipeline-studio-node-context'
import { PipelineNodes } from '../pipeline-nodes'

export interface CustomAddNodeDataType extends CommonNodeDataType {}

export function CustomAddNode(props: { node: LeafNodeInternalType<CustomAddNodeDataType> }) {
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
