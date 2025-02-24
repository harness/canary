import React from 'react'

import { parse } from 'yaml'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { ContainerNode } from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { SimpleParallelGroupNodeContent } from './nodes-simple/simple-parallel-group-node'
import { SimpleSerialGroupContentNode } from './nodes-simple/simple-stage-node'
import { SimpleStepNode } from './nodes-simple/simple-step-node'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'
import { ContentNodeTypes } from './types/content-node-types'

import './sample-data/pipeline-data'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.step,
    containerType: ContainerNode.leaf,
    component: SimpleStepNode
  },
  {
    type: ContentNodeTypes.parallel,
    containerType: ContainerNode.parallel,
    component: SimpleParallelGroupNodeContent
  } as NodeContent,
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SimpleSerialGroupContentNode
  } as NodeContent,
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: SimpleSerialGroupContentNode
  } as NodeContent
]

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject, {})

function Demo5Size() {
  return (
    <CanvasProvider>
      <PipelineGraph data={plData} nodes={nodes} />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo5Size
