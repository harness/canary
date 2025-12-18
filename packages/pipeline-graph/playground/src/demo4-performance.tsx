import React from 'react'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { ContainerNode } from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupNodeContent } from './nodes/serial-group-node'
import { StartNode } from './nodes/start-node'
import { StepNode } from './nodes/step-node'
import { getPipeline } from './sample-data/pipeline-data'
import { ContentNodeTypes } from './types/content-node-types'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.start,
    containerType: ContainerNode.leaf,
    component: StartNode
  },
  {
    type: ContentNodeTypes.end,
    containerType: ContainerNode.leaf,
    component: EndNode
  },
  {
    type: ContentNodeTypes.step,
    containerType: ContainerNode.leaf,
    component: StepNode
  },
  {
    containerType: ContainerNode.leaf,
    type: ContentNodeTypes.approval,
    component: ApprovalNode
  },
  {
    type: ContentNodeTypes.parallel,
    containerType: ContainerNode.parallel,
    component: ParallelGroupNodeContent
  } as NodeContent,
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeContent
  } as NodeContent
]

const data = getPipeline(9, 12, 3, 'success')

function Demo4Performance() {
  return (
    <CanvasProvider>
      <PipelineGraph
        data={data}
        nodes={nodes}
        edgesConfig={{ parallelNodeOffset: 8, serialNodeOffset: 8, radius: 4 }}
        serialContainerConfig={{
          nodeGap: 16,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          serialGroupAdjustment: 0
        }}
        parallelContainerConfig={{
          nodeGap: 16,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          parallelGroupAdjustment: 0
        }}
      />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo4Performance
