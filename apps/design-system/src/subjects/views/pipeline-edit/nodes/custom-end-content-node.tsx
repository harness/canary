import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { PipelineNodes } from '../pipeline-nodes'

export interface EndNodeDataType {}

export function CustomEndContentNode(_props: { node: LeafNodeInternalType<EndNodeDataType> }) {
  return <PipelineNodes.EndNode />
}
