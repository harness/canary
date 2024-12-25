import { parse } from 'yaml'

import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { ContainerNode } from '../../src/types/nodes'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'

import './sample-data/pipeline-data'

import React from 'react'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { CanvasControls } from './canvas/CanvasControls'
import { SimpleParallelGroupNodeContent } from './nodes-simple/simple-parallel-group-node'
import { SimpleSerialGroupContentNode } from './nodes-simple/simple-stage-node'
import { SimpleStepNode } from './nodes-simple/simple-step-node'
import { ContentNodeTypes } from './types/content-node-types'

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

function Example4() {
  return (
    <div
      style={{
        position: 'relative',
        left: '5vw',
        top: '10vh',
        height: '80vh',
        width: '90vw',
        overflow: 'hidden',
        border: '1px solid gray'
      }}
    >
      <CanvasProvider>
        <PipelineGraph data={plData} nodes={nodes} />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}

export default Example4
