import { useEffect, useRef, useState } from 'react'

import { cloneDeep, get, set } from 'lodash-es'
import { parse } from 'yaml'

import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import { AnyNodeType, ContainerNode, LeafNodeType, ParallelNodeType, SerialNodeType } from '../../src/types/nodes'
import { getPathPeaces } from '../../src/utils/path-utils'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupNodeContent } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode, StepNodeDataType } from './nodes/step-node'
import { yaml2Nodes } from './parser/yaml2AnyNodes'
import { pipeline } from './sample-data/pipeline'

import './sample-data/pipeline-data'

import React from 'react'

import CanvasProvider from '../../src/context/CanvasProvider'
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
  },
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeContent
  }
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
  }
} satisfies LeafNodeType

const endNode = {
  type: ContentNodeTypes.end,
  config: {
    width: 80,
    height: 80,
    hideDeleteButton: true,
    hideAfterAdd: true,
    hideRightPort: true
  }
} satisfies LeafNodeType

plData.unshift(startNode)
plData.push(endNode)

function Example0({ addStepType }: { addStepType: ContentNodeTypes }) {
  const dataRef = useRef(plData)
  const [data, setData] = useState<AnyNodeType[]>()

  useEffect(() => {
    setData(plData)
  }, [])

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
          onSelect={(path: string) => console.log('select:' + path)}
          onAdd={(path: string, position: 'before' | 'after' | 'in') => {
            const newData = cloneDeep(data)

            const itemPath = path.replace(/^pipeline.children./, '')

            if (position === 'in') {
              // add to (empty) array
              const childrenPath = itemPath + '.children'

              const arr = get(newData, childrenPath, []) as unknown[]
              arr.push(getNode(addStepType))
              set(newData, childrenPath, arr)
            } else {
              // add before or after
              const { arrayPath, index } = getPathPeaces(itemPath)
              const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData

              arr.splice(position === 'before' ? index : index + 1, 0, getNode(addStepType))
            }

            setData(newData)
          }}
          onDelete={(path: string) => {
            const newData = cloneDeep(data)

            const { arrayPath, index } = getPathPeaces(path.replace(/^pipeline.children./, ''))
            // shift collapsed nodes

            const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData

            arr.splice(index, 1)

            setData(newData)
          }}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}

export default Example0

function getNode(stepType: ContentNodeTypes) {
  switch (stepType) {
    case ContentNodeTypes.step:
      return {
        type: ContentNodeTypes.step,
        config: {
          width: 180
        },
        data: {
          yamlPath: 'qwe-' + Math.random(),
          name: 'step',
          icon: getIcon(1)
        } satisfies StepNodeDataType
      } satisfies LeafNodeType
    case ContentNodeTypes.parallel:
      return {
        type: ContentNodeTypes.parallel,
        children: [],
        config: {
          minWidth: 180
        },
        data: {
          yamlPath: 'qwe-' + Math.random(),
          name: 'Parallel'
        } satisfies StepNodeDataType
      } satisfies ParallelNodeType
    case ContentNodeTypes.serial:
      return {
        type: ContentNodeTypes.serial,
        children: [],
        config: {
          minWidth: 180
        },
        data: {
          yamlPath: 'qwe-' + Math.random(),
          name: 'Serial'
        } satisfies StepNodeDataType
      } satisfies SerialNodeType
  }
}
