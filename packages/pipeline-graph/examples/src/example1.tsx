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
// import { getPathPieces } from '../../src/utils/path-utils'
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
import CustomPort from './ports/custom-port'
import { getExecutionPipeline } from './sample-data/pipeline-data'
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
  // const plData2 = getExecutionPipeline()
  const [data, setData] = useState<AnyContainerNodeType[]>(plData)

  const dataRef = useRef(data)
  dataRef.current = data

  if (!data) return null

  const pathsRef = useRef([
    ['1', '1.children.0'],
    ['1.children.0.children.0', '1.children.0.children.0.children.0'],
    ['1.children.1', '1.children.1.children.0', '1.children.1.children.1'],
    ['1', '1.children.0', '1.children.0.children.0', '1.children.0.children.0.children.0'],
    [
      '1.children.0.children.1',
      '1.children.0.children.1.children.0',
      '1.children.0.children.1.children.0.children.0',
      '1.children.0.children.1.children.0.children.1',
      '1.children.0.children.1.children.0.children.1.children.0',
      '1.children.0.children.1.children.0.children.1',
      '1.children.0.children.1.children.0.children.1.children.0'
    ]

    // ['0'],
    // ['1'],
    // ['2.children.0', '2.children.1'],
    // ['2.children.2'],
    // ['3'],
    // ['4.children.0', '4.children.1'],
    // ['5']
  ])

  const executedPathsRef = useRef<string[]>([])
  const executingPathsRef = useRef<string[]>([])

  const animate = () => {
    const newData = cloneDeep(dataRef.current)

    // 1. set executed to executing
    executingPathsRef.current.forEach(cPath => {
      const step = get(newData, cPath) as any
      step.data.state = 'executed'
    })

    // 2. set executing to next group
    const newPathGroup = pathsRef.current.shift()
    newPathGroup?.forEach(cPath => {
      const step = get(newData, cPath)
      step.data.state = 'executing'
      executingPathsRef.current.push(cPath)
    })

    setData(newData)
  }

  useEffect(() => {
    animate()
    setInterval(() => {
      animate()
    }, 2900)
  }, [])

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
          customCreateSVGPath={props => {
            const { id, path, pathLength, targetNode } = props

            const pathStyle = targetNode?.data.state === 'executed' ? ` stroke="#00ff00"` : ` stroke="#ff00ff"`
            const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle}  stroke-width="2"/>`

            // let animationPath: string = ''
            // if (targetNode?.data.state === 'executing') {
            //   animationPath = `<path d="${path}" id="${id}" fill="none" stroke="#2299AA" class="PipelineGraph-AnimatePath" stroke-dasharray="${pathLength}" stroke-dashoffset="${pathLength}" />`
            // }

            return { level1: staticPath, level2: '' }
          }}
          portComponent={CustomPort}
          edgesConfig={{ radius: 10, parallelNodeOffset: 10, serialNodeOffset: 10 }}
          serialContainerConfig={{}}
          parallelContainerConfig={{}}
          data={data}
          nodes={nodes}
          // onSelect={(node: AnyNodeInternal) => {
          //   const newData = cloneDeep(data)
          //   const itemPath = node.path.replace(/^/, '')
          //   const targetNode = get(newData, itemPath) as { data: { selected: boolean } }
          //   targetNode.data.selected = !targetNode.data.selected
          //   setData(newData)
          // }}
          // onAdd={(node: AnyNodeInternal, position: 'before' | 'after' | 'in') => {
          //   const newData = cloneDeep(data)
          //   const itemPath = node.path.replace(/^/, '')

          //   if (position === 'in') {
          //     // add to (empty) array
          //     const childrenPath = itemPath + '.children'
          //     const arr = get(newData, childrenPath, []) as unknown[]
          //     arr.push(getNode(addStepType))
          //     set(newData, childrenPath, arr)
          //   } else {
          //     // add before or after
          //     const { arrayPath, index } = getPathPieces(itemPath)
          //     const arr = arrayPath ? (get(newData, arrayPath) as unknown[]) : newData

          //     arr.splice(position === 'before' ? index : index + 1, 0, getNode(addStepType))
          //   }

          //   setData(newData)
          // }}
          // onDelete={(node: AnyNodeInternal) => {
          //   const newData = cloneDeep(data)
          //   const { arrayPath, index } = getPathPieces(node.path.replace(/^/, ''))
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
          state: 'executing'
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
