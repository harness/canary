import { LeafNodeInternalType } from '@harnessio/pipeline-graph'
import { PipelineNodes } from '@harnessio/ui/components'

export interface StartNodeDataType {}

export function StartNode(_props: { node: LeafNodeInternalType<StartNodeDataType> }) {
  return <PipelineNodes.StartNode />
}
