import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

import { useNodeContext } from '../../../context/NodeContextMenuProvider'
import { CommonNodeDataType } from '../types/nodes'

export interface AddNodeDataType extends CommonNodeDataType {}

export function AddNode(props: { node: LeafNodeInternalType<AddNodeDataType> }) {
  const { node } = props
  const { data } = node

  const { handleAddIn } = useNodeContext()

  return (
    <PipelineNodes.AddNode
      onClick={e => {
        handleAddIn(data, e.currentTarget)
      }}
    />
  )
}
