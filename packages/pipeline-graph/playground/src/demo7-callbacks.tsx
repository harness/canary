import React, { useState } from 'react'

import { CollapseButtonProps } from '../../src'
import { CanvasProvider } from '../../src/context/canvas-provider'
import { PipelineGraph } from '../../src/pipeline-graph'
import { NodeContent } from '../../src/types/node-content'
import {
  AnyContainerNodeType,
  ContainerNode,
  LeafContainerNodeType,
  OnCollapseChangeCallback,
  OnCollapseErrorCallback,
  OnCollapseSuccessCallback,
  ParallelContainerNodeType,
  SerialContainerNodeType
} from '../../src/types/nodes'
import { CanvasControls } from './canvas/CanvasControls'
import { ApprovalNode } from './nodes/approval-node'
import { EndNode } from './nodes/end-node'
import { ParallelGroupContentNodeDataType, ParallelGroupNodeContent } from './nodes/parallel-group-node'
import { SerialGroupContentNode, StageNodeContentType } from './nodes/stage-node'
import { StartNode } from './nodes/start-node'
import { StepNode, StepNodeDataType } from './nodes/step-node'
import CustomPort from './ports/custom-port'
import { ContentNodeTypes } from './types/content-node-types'

import './sample-data/pipeline-data'

import { getIcon } from './parser/utils'

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

// Fake API call function
const fakeApiCall = (nodeName: string, delay: number = 1500): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 10% chance of failure for demonstration
      if (Math.random() < 0.1) {
        console.error(`API call failed for ${nodeName}`)
        reject(new Error(`Failed to load data for ${nodeName}`))
      } else {
        console.log(`API call successful for ${nodeName}`)
        resolve()
      }
    }, delay)
  })
}

// Create callback function for a node
const createCollapseCallback = (nodeName: string, delay: number = 1500): OnCollapseChangeCallback => {
  return async (path: string, collapsed: boolean, node: any) => {
    const action = collapsed ? 'collapsing' : 'expanding'
    console.log(`${action} ${nodeName} (path: ${path})...`)
    await fakeApiCall(nodeName, delay)
    console.log(`${nodeName} ${collapsed ? 'collapsed' : 'expanded'} successfully`)
  }
}

// Create onSuccess callback
const createSuccessCallback = (nodeName: string): OnCollapseSuccessCallback => {
  return async (path: string, collapsed: boolean, node: any) => {
    console.log(`✅ Success callback for ${nodeName}: ${collapsed ? 'collapsed' : 'expanded'}`)
    // Example: Could update analytics, refresh data, show notification, etc.
    // await updateAnalytics(nodeName, collapsed)
    // await showNotification(`Node ${nodeName} ${collapsed ? 'collapsed' : 'expanded'}`)
  }
}

// Create onError callback
const createErrorCallback = (nodeName: string): OnCollapseErrorCallback => {
  return async (path: string, collapsed: boolean, node: any, error: Error) => {
    console.error(`❌ Error callback for ${nodeName}:`, error.message)
    // Example: Could show error toast, log to error tracking service, etc.
    // await logErrorToService(nodeName, error)
    // await showErrorToast(`Failed to ${collapsed ? 'collapse' : 'expand'} ${nodeName}`)
  }
}

// Create complex nested data structure
const createPlData = (): AnyContainerNodeType[] => {
  const startNode: LeafContainerNodeType = {
    type: ContentNodeTypes.start,
    config: {
      width: 80,
      height: 80,
      hideDeleteButton: true,
      hideBeforeAdd: true,
      hideLeftPort: true
    },
    data: {}
  }

  const endNode: LeafContainerNodeType = {
    type: ContentNodeTypes.end,
    config: {
      width: 80,
      height: 80,
      hideDeleteButton: true,
      hideAfterAdd: true,
      hideRightPort: true
    },
    data: {}
  }

  // First serial group (collapsed by default, with all callbacks)
  const serialGroup1: SerialContainerNodeType = {
    type: ContentNodeTypes.serial,
    config: {
      minWidth: 140,
      initialCollapsed: true, // Collapsed by default
      onCollapseChange: createCollapseCallback('Serial Group 1', 2000),
      onCollapseSuccess: createSuccessCallback('Serial Group 1'),
      onCollapseError: createErrorCallback('Serial Group 1')
    },
    data: {
      yamlPath: 'pipeline.stages.0',
      name: 'Serial Group 1'
    } satisfies StageNodeContentType,
    children: [
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.0.steps.0',
          name: 'Step 1.1',
          icon: getIcon(1)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType,
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.0.steps.1',
          name: 'Step 1.2',
          icon: getIcon(2)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    ]
  }

  // Parallel group (expanded by default, with callback, onSuccess, and onError)
  const parallelGroup1: ParallelContainerNodeType = {
    type: ContentNodeTypes.parallel,
    config: {
      minWidth: 140,
      onCollapseChange: createCollapseCallback('Parallel Group 1', 1800),
      onCollapseSuccess: createSuccessCallback('Parallel Group 1'),
      onCollapseError: createErrorCallback('Parallel Group 1')
    },
    data: {
      yamlPath: 'pipeline.stages.1',
      name: 'Parallel Group 1'
    } satisfies ParallelGroupContentNodeDataType,
    children: [
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.1.steps.0',
          name: 'Parallel Step 1',
          icon: getIcon(3)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType,
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.1.steps.1',
          name: 'Parallel Step 2',
          icon: getIcon(4)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    ]
  }

  // Second serial group (collapsed by default, with all callbacks, nested structure)
  const serialGroup2: SerialContainerNodeType = {
    type: ContentNodeTypes.serial,
    config: {
      minWidth: 140,
      initialCollapsed: true, // Collapsed by default
      onCollapseChange: createCollapseCallback('Serial Group 2', 1200),
      onCollapseSuccess: createSuccessCallback('Serial Group 2'),
      onCollapseError: createErrorCallback('Serial Group 2')
    },
    data: {
      yamlPath: 'pipeline.stages.2',
      name: 'Serial Group 2'
    } satisfies StageNodeContentType,
    children: [
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.2.steps.0',
          name: 'Step 2.1',
          icon: getIcon(5)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType,
      // Nested parallel group inside serial group (collapsed by default, with all callbacks)
      {
        type: ContentNodeTypes.parallel,
        config: {
          minWidth: 140,
          initialCollapsed: true, // Collapsed by default
          onCollapseChange: createCollapseCallback('Nested Parallel Group', 1000),
          onCollapseSuccess: createSuccessCallback('Nested Parallel Group'),
          onCollapseError: createErrorCallback('Nested Parallel Group')
        },
        data: {
          yamlPath: 'pipeline.stages.2.steps.1',
          name: 'Nested Parallel Group'
        } satisfies ParallelGroupContentNodeDataType,
        children: [
          {
            type: ContentNodeTypes.step,
            config: { minWidth: 140 },
            data: {
              yamlPath: 'pipeline.stages.2.steps.1.steps.0',
              name: 'Nested Step 1',
              icon: getIcon(6)
            } satisfies StepNodeDataType
          } satisfies LeafContainerNodeType,
          {
            type: ContentNodeTypes.step,
            config: { minWidth: 140 },
            data: {
              yamlPath: 'pipeline.stages.2.steps.1.steps.1',
              name: 'Nested Step 2',
              icon: getIcon(7)
            } satisfies StepNodeDataType
          } satisfies LeafContainerNodeType
        ]
      } satisfies ParallelContainerNodeType,
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.2.steps.2',
          name: 'Step 2.3',
          icon: getIcon(8)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    ]
  }

  // Third serial group (expanded by default, no callback - tests backward compatibility)
  const serialGroup3: SerialContainerNodeType = {
    type: ContentNodeTypes.serial,
    config: {
      minWidth: 140
      // No callback - should work immediately (backward compatibility)
    },
    data: {
      yamlPath: 'pipeline.stages.3',
      name: 'Serial Group 3 (No Callback)'
    } satisfies StageNodeContentType,
    children: [
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.3.steps.0',
          name: 'Step 3.1',
          icon: getIcon(9)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType,
      {
        type: ContentNodeTypes.step,
        config: { minWidth: 140 },
        data: {
          yamlPath: 'pipeline.stages.3.steps.1',
          name: 'Step 3.2',
          icon: getIcon(10)
        } satisfies StepNodeDataType
      } satisfies LeafContainerNodeType
    ]
  }

  return [startNode, serialGroup1, parallelGroup1, serialGroup2, serialGroup3, endNode]
}

const data = createPlData()

function Demo7Callbacks() {
  return (
    <CanvasProvider>
      <PipelineGraph
        customCreateSVGPath={props => {
          const { id, path, targetNode } = props
          const pathStyle = targetNode?.data.state === 'executed' ? ` stroke="#00ff00"` : ` stroke="#ff00ff"`
          const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle}  stroke-width="1"/>`
          return { level1: staticPath, level2: '' }
        }}
        portComponent={CustomPort}
        edgesConfig={{ radius: 2, parallelNodeOffset: 6, serialNodeOffset: 6 }}
        serialContainerConfig={{
          nodeGap: 16,
          paddingBottom: 5,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 60,
          serialGroupAdjustment: 30
        }}
        parallelContainerConfig={{
          nodeGap: 16,
          paddingBottom: 5,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 60,
          parallelGroupAdjustment: 30
        }}
        config={{ leftGap: 100 }}
        collapseButtonComponent={CustomCollapseButtonComponent}
        data={data}
        nodes={nodes}
      />
      <CanvasControls />
    </CanvasProvider>
  )
}

export default Demo7Callbacks

// Custom collapse button component that shows loading state
const CustomCollapseButtonComponent = (props: CollapseButtonProps): JSX.Element => {
  const { collapsed, onToggle, isLoading } = props

  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      style={{
        padding: '4px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: isLoading ? '#f0f0f0' : '#fff',
        cursor: isLoading ? 'wait' : 'pointer',
        opacity: isLoading ? 0.6 : 1
      }}
    >
      {isLoading ? `⏳` : collapsed ? '+' : '-'}
    </button>
  )
}
