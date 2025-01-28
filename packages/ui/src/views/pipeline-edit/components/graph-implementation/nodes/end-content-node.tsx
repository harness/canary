import { PipelineNodes } from '@components/pipeline-nodes'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

export interface EndNodeDataType {}

export function EndContentNode(_props: { node: LeafNodeInternalType<EndNodeDataType> }) {
  return <PipelineNodes.EndNode />
}
