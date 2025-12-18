import React, { useState } from 'react'

import { parse } from 'yaml'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { AnyContainerNodeType, ContainerNode, LeafContainerNodeType } from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupNodeContent } from './nodes/serial-group-node'
import { StageContentNode } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode } from './nodes/step-node'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'
import { ContentNodeTypes } from './types/content-node-types'

import './sample-data/pipeline-data'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.start,
    component: StartNode,
    containerType: ContainerNode.leaf
  },
  {
    type: ContentNodeTypes.end,
    containerType: ContainerNode.leaf,
    component: EndNode
  },
  {
    containerType: ContainerNode.leaf,
    type: ContentNodeTypes.step,
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
  } as NodeContent,
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: StageContentNode
  } as NodeContent
]

const getHeaderHeight = node => {
  switch (node.type) {
    case ContentNodeTypes.serial:
      return 121
    case ContentNodeTypes.parallel:
      return 121
    case ContentNodeTypes.stage:
      return 171
    default:
      return 0
  }
}

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject)

const startNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 60,
    height: 160,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  },
  data: {}
} satisfies LeafContainerNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 60,
    height: 160,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  },
  data: {}
} satisfies LeafContainerNodeType

plData.unshift(startNode)
plData.push(endNode)

function Demo1() {
  const [data] = useState<AnyContainerNodeType[]>(plData)

  return (
    <CanvasProvider>
      <PipelineGraph
        data={data}
        nodes={nodes}
        layout={{
          type: 'harness',
          leafPortPosition: 80,
          getHeaderHeight,
          collapsedPortPositionPerType: {
            stage: 100,
            parallel: 100,
            serial: 100
          }
        }}
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

export default Demo1
