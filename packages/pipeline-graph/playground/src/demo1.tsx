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
import { SerialGroupContentNode } from './nodes/stage-node'
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
    component: SerialGroupContentNode
  } as NodeContent
]

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject)

const startNode = {
  type: ContentNodeTypes.start,
  config: {
    width: 80,
    height: 80,
    hideDeleteButton: true,
    hideBeforeAdd: true,
    hideLeftPort: true
  },
  data: {}
} satisfies LeafContainerNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 80,
    height: 80,
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
      <PipelineGraph data={data} nodes={nodes} />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo1
