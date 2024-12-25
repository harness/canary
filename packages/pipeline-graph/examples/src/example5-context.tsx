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
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupContentNode } from './nodes/stage-node'
import { StepNode } from './nodes/step-node'
import { ContentNodeTypes } from './types/content-node-types'

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.step,
    containerType: ContainerNode.leaf,
    component: StepNode
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
  } as NodeContent,
  {
    type: ContentNodeTypes.stage,
    containerType: ContainerNode.serial,
    component: SerialGroupContentNode
  } as NodeContent
]

const yamlObject = parse(pipeline)
const plData = yaml2Nodes(yamlObject, {})

function ContextExample() {
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
        <PipelineGraph
          data={plData}
          nodes={nodes}
          // onSelect={() => {}}
          // onAdd={() => {}}
          // onDelete={() => {}}
          // onContext={(node, e) => {
          //   e.preventDefault()
          //   console.log(node, e)
          //   const el = document.getElementsByClassName('context-menu')[0] as HTMLDivElement
          //   el.style.display = 'block'
          //   el.style.position = 'absolute'
          //   el.style.zIndex = '1000'
          //   el.style.top = (e as MouseEvent).pageY - 40 + 'px'
          //   el.style.left = (e as MouseEvent).pageX - 40 + 'px'
          // }}
        />
        <CanvasControls />
      </CanvasProvider>
      <div
        style={{ display: 'none', background: 'black', border: '1px solid #666', color: '#777' }}
        className="context-menu"
      >
        <ContextItem>Add step before</ContextItem>
        <ContextItem>Add step after</ContextItem>
        <ContextItem>Delete step</ContextItem>
        <ContextItem>Preview</ContextItem>
        <ContextItem>Open in Yaml</ContextItem>
      </div>
    </div>
  )
}

export default ContextExample

function ContextItem({ children }): React.ReactNode {
  return <div style={{ borderBottom: '1px solid #666', padding: '10px' }}>{children}</div>
}
