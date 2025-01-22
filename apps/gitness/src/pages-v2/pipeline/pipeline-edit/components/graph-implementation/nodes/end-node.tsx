import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

export interface EndNodeDataType {}

export function EndNode(_props: { node: LeafNodeInternalType<EndNodeDataType> }) {
  return <PipelineNodes.EndNode />
}
