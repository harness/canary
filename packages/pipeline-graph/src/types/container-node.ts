import { NodeProps } from './nodes'
import { AnyNodeInternal, ParallelNodeInternalType, SerialNodeInternalType } from './nodes-internal'

export type ContainerNodeType = 'leaf' | 'serial' | 'parallel'

export interface ContainerNodeProps<CONTAINER_NODE = AnyNodeInternal> extends NodeProps {
  /* node itself :) */
  node: CONTAINER_NODE
  parentNode?: ParallelNodeInternalType | SerialNodeInternalType
  /* what type is a parent node */
  parentNodeType?: ContainerNodeType
  /* nesting level from root */
  level: number
  /* position in array relative to parent */
  relativeIndex: number
  /* is first node in array relative to parent */
  isFirst: boolean
  /* is last node in array relative to parent */
  isLast: boolean
}

interface CommonContainerConfig {
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
}
export interface ParallelContainerConfig extends CommonContainerConfig {
  nodeGap: number
  parallelGroupAdjustment?: number
}

export interface SerialContainerConfig extends CommonContainerConfig {
  nodeGap: number
  serialGroupAdjustment?: number
}
