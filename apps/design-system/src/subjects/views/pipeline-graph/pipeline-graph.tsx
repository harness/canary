import {
  AnyContainerNodeType,
  CanvasProvider,
  ContainerNode,
  LeafNodeInternalType,
  NodeContent,
  ParallelNodeContent,
  ParallelNodeInternalType,
  PipelineGraph,
  SerialNodeContent,
  SerialNodeInternalType
} from '@harnessio/pipeline-graph'
import { Icon, PipelineNodes } from '@harnessio/ui/components'
import { PipelineStudioFooter } from '@harnessio/ui/views'

// *****************************************************
// 1. Import CSS
// *****************************************************

import '@harnessio/pipeline-graph/dist/index.css'

// *****************************************************
// 2. Define content nodes types
// *****************************************************

export enum ContentNodeTypes {
  add = 'add',
  start = 'start',
  end = 'end',
  step = 'step',
  approval = 'approval',
  parallel = 'parallel',
  serial = 'serial',
  stage = 'stage'
}

// *****************************************************
// 3. Define nodes
// *****************************************************

// * start node
const StartNodeComponent = () => <PipelineNodes.StartNode />

// * end node
const EndNodeComponent = () => <PipelineNodes.EndNode />

// * step node
export interface StepNodeDataType {
  name?: string
  icon?: React.ReactElement
  selected?: boolean
}

export function StepNodeComponent({ node }: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { name, icon } = node.data

  return <PipelineNodes.StepNode name={name} icon={icon} onEllipsisClick={() => undefined} />
}

// * approval step node
export interface ApprovalNodeDataType {
  name?: string
  selected?: boolean
}

export function ApprovalStepNodeComponent({ node }: { node: LeafNodeInternalType<ApprovalNodeDataType> }) {
  const { name } = node.data

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="border-borders-2 bg-primary-foreground absolute -z-10 rotate-45 border"
        style={{ inset: '18px' }}
      ></div>
      <div>{name}</div>
    </div>
  )
}

// * serial group node
export interface SerialGroupNodeDataType {
  name?: string
  selected?: boolean
}

export function SerialGroupNodeComponent({
  node,
  children
}: {
  node: SerialNodeInternalType<SerialGroupNodeDataType>
  children: React.ReactElement
}) {
  const { name } = node.data

  return (
    <PipelineNodes.SerialGroupNode
      name={name}
      onEllipsisClick={() => undefined}
      onAddClick={() => undefined}
      onHeaderClick={() => undefined}
      onAddInClick={() => undefined}
    >
      {children}
    </PipelineNodes.SerialGroupNode>
  )
}

// * parallel group node
export interface ParallelGroupNodeDataType {
  name?: string
  selected?: boolean
}

export function ParallelGroupNodeComponent({
  node,
  children
}: {
  node: ParallelNodeInternalType<ParallelGroupNodeDataType>
  children: React.ReactElement
}) {
  const { name } = node.data

  return (
    <PipelineNodes.ParallelGroupNode
      name={name}
      onEllipsisClick={() => undefined}
      onAddClick={() => undefined}
      onHeaderClick={() => undefined}
      onAddInClick={() => undefined}
    >
      {children}
    </PipelineNodes.ParallelGroupNode>
  )
}

// *****************************************************
// 4. Match Content and containers nodes
// *****************************************************

const nodes: NodeContent[] = [
  {
    type: ContentNodeTypes.start,
    containerType: ContainerNode.leaf,
    component: StartNodeComponent
  },
  {
    type: ContentNodeTypes.end,
    containerType: ContainerNode.leaf,
    component: EndNodeComponent
  },
  {
    type: ContentNodeTypes.serial,
    containerType: ContainerNode.serial,
    component: SerialGroupNodeComponent
  } as SerialNodeContent,
  {
    type: ContentNodeTypes.parallel,
    containerType: ContainerNode.parallel,
    component: ParallelGroupNodeComponent
  } as ParallelNodeContent,
  {
    type: ContentNodeTypes.step,
    containerType: ContainerNode.leaf,
    component: StepNodeComponent
  } as NodeContent,
  {
    type: ContentNodeTypes.approval,
    containerType: ContainerNode.leaf,
    component: ApprovalStepNodeComponent
  } as NodeContent
]

// *****************************************************
// 5. Graph data model
// *****************************************************

const data: AnyContainerNodeType[] = [
  {
    type: ContentNodeTypes.start,
    data: {},
    config: {
      width: 40,
      height: 40,
      hideLeftPort: true
    }
  },
  {
    type: ContentNodeTypes.step,
    data: {
      name: 'Step 1',
      icon: <Icon name="harness-plugin" className="m-2 size-8" />
    } satisfies StepNodeDataType,
    config: {
      width: 160,
      height: 80
    }
  },
  {
    type: ContentNodeTypes.approval,
    data: {
      name: 'Approval 1',
      icon: <Icon name="harness-plugin" className="m-2 size-8" />
    } satisfies StepNodeDataType,
    config: {
      width: 120,
      height: 120
    }
  },
  {
    type: ContentNodeTypes.serial,
    config: {
      minWidth: 200,
      minHeight: 40
    },
    data: {
      name: 'Serial group'
    } satisfies SerialGroupNodeDataType,
    children: [
      {
        type: ContentNodeTypes.step,
        data: {
          name: 'Step 2',
          icon: <Icon name="harness-plugin" className="m-2 size-8" />
        } satisfies StepNodeDataType,
        config: {
          width: 160,
          height: 80
        }
      },
      {
        type: ContentNodeTypes.step,
        data: {
          name: 'Step 3',
          icon: <Icon name="harness-plugin" className="m-2 size-8" />
        } satisfies StepNodeDataType,
        config: {
          width: 160,
          height: 80
        }
      }
    ]
  },
  {
    type: ContentNodeTypes.parallel,
    config: {
      minWidth: 200,
      minHeight: 40
    },
    data: {
      name: 'Parallel group'
    } satisfies ParallelGroupNodeDataType,
    children: [
      {
        type: ContentNodeTypes.step,
        data: {
          name: 'Step 4',
          icon: <Icon name="harness-plugin" className="m-2 size-8" />
        } satisfies StepNodeDataType,
        config: {
          width: 160,
          height: 80
        }
      },
      {
        type: ContentNodeTypes.step,
        data: {
          name: 'Step 4',
          icon: <Icon name="harness-plugin" className="m-2 size-8" />
        } satisfies StepNodeDataType,
        config: {
          width: 160,
          height: 80
        }
      }
    ]
  },
  {
    type: ContentNodeTypes.end,
    data: {},
    config: {
      width: 40,
      height: 40,
      hideRightPort: true
    }
  }
]

const PipelineGraphWrapper = () => {
  return (
    <>
      <CanvasProvider>
        <PipelineGraph data={data} nodes={nodes} />
      </CanvasProvider>
      <PipelineStudioFooter
        problems={{ error: 0, warning: 3, info: 2 }}
        lastCommitInfo={{ authorName: 'User Name', committedTimeAgo: '3 days ago' }}
      />
    </>
  )
}

export default PipelineGraphWrapper
