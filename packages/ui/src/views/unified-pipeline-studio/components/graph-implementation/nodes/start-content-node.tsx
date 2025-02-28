import { PipelineNodes } from '@components/pipeline-nodes'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface StartNodeDataType {}

export function StartContentNode(_props: { node: LeafNodeInternalType<StartNodeDataType> }) {
  return <PipelineNodes.StartNode />
}
