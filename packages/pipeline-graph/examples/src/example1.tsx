import { useEffect, useRef, useState } from 'react'

import { cloneDeep, get, set } from 'lodash-es'
import { parse } from 'yaml'

import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import {
  AnyContainerNodeType,
  ContainerNode,
  LeafContainerNodeType,
  ParallelContainerNodeType,
  SerialContainerNodeType
} from '../../src/types/nodes'
import { getPathPeaces } from '../../src/utils/path-utils'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupContentNode } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode, StepNodeDataType } from './nodes/step-node'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'

import './sample-data/pipeline-data'

import React from 'react'

import { CanvasProvider } from '../../src/context/canvas-provider'
import { AnyNodeInternal } from '../../src/types/nodes-internal'
import { CanvasControls } from './canvas/CanvasControls'
import { getIcon } from './parser/utils'
import { ContentNodeTypes } from './types/content-node-types'

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

function Example1({ addStepType }: { addStepType: ContentNodeTypes }) {
  const [data] = useState<AnyContainerNodeType[]>(plData)

  if (!data) return null

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
          data={data}
          nodes={nodes}
          // onSelect={(node: AnyNodeInternal) => {
          //   const newData = cloneDeep(data)
          //   const itemPath = node.path.replace(/^pipeline.children./, '')
          //   const targetNode = get(newData, itemPath) as { data: { selected: boolean } }
          //   targetNode.data.selected = !targetNode.data.selected
          //   setData(newData)
          // }}
          // onAdd={(node: AnyNodeInternal, position: 'before' | 'after' | 'in') => {
          //   const newData = cloneDeep(data)
          //   const itemPath = node.path.replace(/^pipeline.children./, '')

          //   if (position === 'in') {
          //     // add to (empty) array
          //     const childrenPath = itemPath + '.children'
          //     const arr = get(newData, childrenPath, []) as unknown[]
          //     arr.push(getNode(addStepType))
          //     set(newData, childrenPath, arr)
          //   } else {
          //     // add before or after
          //     const { arrayPath, index } = getPathPeaces(itemPath)
          //     const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData

          //     arr.splice(position === 'before' ? index : index + 1, 0, getNode(addStepType))
          //   }

          //   setData(newData)
          // }}
          // onDelete={(node: AnyNodeInternal) => {
          //   const newData = cloneDeep(data)
          //   const { arrayPath, index } = getPathPeaces(node.path.replace(/^pipeline.children./, ''))
          //   const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData
          //   arr.splice(index, 1)
          //   setData(newData)
          // }}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}

export default Example1

function getNode(stepType: ContentNodeTypes) {
  switch (stepType) {
    case ContentNodeTypes.step:
      return {
        type: ContentNodeTypes.step,
        config: {
          width: 180
        },
        data: {
          yamlPath: '',
          name: 'step',
          icon: getIcon(1),
          state: 'loading'
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    case ContentNodeTypes.parallel:
      return {
        type: ContentNodeTypes.parallel,
        children: [],
        config: {
          minWidth: 180
        },
        data: {
          yamlPath: '',
          name: 'Parallel'
        } satisfies StepNodeDataType
      } satisfies ParallelContainerNodeType
    case ContentNodeTypes.serial:
      return {
        type: ContentNodeTypes.serial,
        children: [],
        config: {
          minWidth: 180
        },
        data: {
          yamlPath: '',
          name: 'Serial'
        } satisfies StepNodeDataType
      } satisfies SerialContainerNodeType
  }
}
