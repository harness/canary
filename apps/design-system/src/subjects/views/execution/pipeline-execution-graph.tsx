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
import { Button, Drawer, Icon, PipelineNodes } from '@harnessio/ui/components'

// *****************************************************
// 1. Import CSS
// *****************************************************

import '@harnessio/pipeline-graph/dist/index.css'

import { ExecutionInfo, LivelogLine, StageProps } from '@harnessio/ui/views'

import { logs, stages } from './mocks/mock-data'

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

interface NodeProps {
  mode?: 'Edit' | 'Execution'
}

interface DataProps {
  stage?: StageProps
  logs?: LivelogLine[]
}

// * step node
export interface StepNodeDataType extends DataProps {
  name?: string
  icon?: React.ReactElement
  selected?: boolean
}

export function StepNodeComponent({
  node,
  mode
}: {
  node: LeafNodeInternalType<StepNodeDataType>
} & NodeProps) {
  const { name, icon, logs, stage } = node.data
  const stepNode = <PipelineNodes.StepNode name={name} icon={icon} onEllipsisClick={() => undefined} mode={mode} />

  if (mode === 'Edit') {
    return stepNode
  }

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>{stepNode}</Drawer.Trigger>
      <Drawer.Content className="flex h-full w-1/2 flex-col justify-between">
        <Drawer.Header>
          <Drawer.Title>Logs</Drawer.Title>
          <Drawer.Description>{`View ${name} execution logs`}</Drawer.Description>
        </Drawer.Header>
        <div>
          <ExecutionInfo
            logs={logs || []}
            onCopy={() => {}}
            onDownload={() => {}}
            onEdit={() => {}}
            selectedStepIdx={0}
            stage={stage || {}}
          />
        </div>
        <Drawer.Footer>
          <Drawer.Close>
            <Button variant="outline">Close</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}

// * approval step node
export interface ApprovalNodeDataType extends DataProps {
  name?: string
  selected?: boolean
}

export function ApprovalStepNodeComponent({
  node,
  mode
}: { node: LeafNodeInternalType<ApprovalNodeDataType> } & NodeProps) {
  const { name } = node.data
  const approvalNode = (
    <div className="flex h-full items-center justify-center">
      <div
        className="border-borders-2 bg-primary-foreground absolute -z-10 rotate-45 border"
        style={{ inset: '18px' }}
      ></div>
      <div>{name}</div>
    </div>
  )

  if (mode === 'Edit') {
    return approvalNode
  }

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>{approvalNode}</Drawer.Trigger>
      <Drawer.Content className="flex h-full w-1/2 flex-col justify-between">
        <div className="flex flex-col gap-4">
          <Drawer.Header>
            <Drawer.Title>Approval</Drawer.Title>
            <Drawer.Description>Approve/Reject step execution</Drawer.Description>
          </Drawer.Header>
          <div className="flex justify-center gap-2">
            <Button type="submit">Approve</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
        <Drawer.Footer>
          <Drawer.Close>
            <Button variant="outline">Close</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  )
}

// * serial group node
export interface SerialGroupNodeDataType {
  name?: string
  selected?: boolean
}

export function SerialGroupNodeComponent({
  node,
  children,
  mode
}: {
  node: SerialNodeInternalType<SerialGroupNodeDataType>
  children: React.ReactElement
} & NodeProps) {
  const { name } = node.data

  return (
    <PipelineNodes.SerialGroupNode
      name={name}
      onEllipsisClick={() => undefined}
      onAddClick={() => undefined}
      onHeaderClick={() => undefined}
      onAddInClick={() => undefined}
      mode={mode}
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
  children,
  mode
}: {
  node: ParallelNodeInternalType<ParallelGroupNodeDataType>
  children: React.ReactElement
} & NodeProps) {
  const { name } = node.data

  return (
    <PipelineNodes.ParallelGroupNode
      name={name}
      onEllipsisClick={() => undefined}
      onAddClick={() => undefined}
      onHeaderClick={() => undefined}
      onAddInClick={() => undefined}
      mode={mode}
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
      icon: <Icon name="harness-plugin" className="m-2 size-8" />,
      logs: logs,
      stage: stages[0]
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

const PipelineExecutionGraph = () => {
  return (
    <CanvasProvider>
      <PipelineGraph data={data} nodes={nodes} config={{ edgeClassName: 'stroke-borders-2', mode: 'Execution' }} />
    </CanvasProvider>
  )
}

export default PipelineExecutionGraph
