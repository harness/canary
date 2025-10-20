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
import { IconV2, Text } from '@harnessio/ui/components'

// *****************************************************
// 1. Import CSS
// *****************************************************

import '@harnessio/pipeline-graph/dist/index.css'

// import { VisualYamlToggle, type VisualYamlValue } from '@harnessio/ui/views'

// *****************************************************
// 2. Define content nodes types
// *****************************************************

export enum ContentNodeTypes {
  step = 'step',
  parallel = 'parallel',
  serial = 'serial'
}

// *****************************************************
// 3. Define nodes
// *****************************************************

// * step node
export interface StepNodeDataType {
  name?: string
  icon?: React.ReactElement
  selected?: boolean
}

export function StepNodeComponent({ node }: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { name, icon } = node.data

  return (
    <div className={'bg-cn-2 border-cn-2 box-border size-full rounded-5 border'}>
      <div>{icon}</div>
      <Text title={name} className="text-cn-1 m-cn-xs line-clamp-2 cursor-default">
        {name}
      </Text>
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
    <>
      <div className="border-cn-2 absolute inset-0 -z-10 rounded-5 border" />
      <div className="absolute inset-x-0 top-0 h-0">
        <div title={name} className="text-cn-3 h-9 cursor-default truncate px-cn-3xl pt-cn-sm">
          {name}
        </div>
      </div>

      {children}
    </>
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
    <>
      <div className="border-cn-2 absolute inset-0 -z-10 rounded-5 border" />
      <div className="absolute inset-x-0 top-0 h-0">
        <div title={name} className="text-cn-3 h-9 cursor-default truncate px-cn-3xl pt-cn-sm">
          {name}
        </div>
      </div>

      {children}
    </>
  )
}

// *****************************************************
// 4. Match Content and containers nodes
// *****************************************************

const nodes: NodeContent[] = [
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
  } as NodeContent
]

// *****************************************************
// 5. Graph data model
// *****************************************************

const data: AnyContainerNodeType[] = [
  {
    type: ContentNodeTypes.step,
    data: {
      name: 'Step 1',
      icon: <IconV2 size="lg" name="harness-plugins" className="m-cn-xs" />
    } satisfies StepNodeDataType,
    config: {
      width: 160,
      height: 80
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
          icon: <IconV2 size="lg" name="harness-plugins" className="m-cn-xs" />
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
          icon: <IconV2 size="lg" name="harness-plugins" className="m-cn-xs" />
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
          icon: <IconV2 size="lg" name="harness-plugins" className="m-cn-xs" />
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
          icon: <IconV2 size="lg" name="harness-plugins" className="m-cn-xs" />
        } satisfies StepNodeDataType,
        config: {
          width: 160,
          height: 80
        }
      }
    ]
  }
]

const PipelineGraphMinimalWrapper = () => {
  // const [view, setView] = useState<VisualYamlValue>('visual')
  return (
    <CanvasProvider>
      {/* <div className="flex px-cn-xl pt-cn-sm">
        <VisualYamlToggle view={view} setView={setView} isYamlValid={true} />
      </div> */}
      <PipelineGraph data={data} nodes={nodes} />
    </CanvasProvider>
  )
}

export default PipelineGraphMinimalWrapper
