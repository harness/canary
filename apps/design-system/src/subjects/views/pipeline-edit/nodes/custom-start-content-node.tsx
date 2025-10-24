import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { PipelineNodes } from '../pipeline-nodes'

export interface CustomStartNodeDataType {}

export function CustomStartContentNode(_props: { node: LeafNodeInternalType<CustomStartNodeDataType> }) {
  return <PipelineNodes.StartNode />
}
