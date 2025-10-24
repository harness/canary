import { ContainerNodeType } from './container-node'
import { ContainerNode, NodeProps } from './nodes'
import { LeafNodeInternalType, ParallelNodeInternalType, SerialNodeInternalType } from './nodes-internal'

export interface LeafNodeContent<T = any> {
  containerType: ContainerNode.leaf
  type: string
  component: (
    props: {
      node: LeafNodeInternalType<T>
      collapsed?: boolean
      children?: React.ReactElement
      isFirst?: boolean
      isLast?: boolean
      parentNodeType?: ContainerNodeType
    } & NodeProps
  ) => JSX.Element
}

export interface SerialNodeContent<T = any> {
  containerType: ContainerNode.serial
  type: string
  component: (
    props: {
      node: SerialNodeInternalType<T>
      collapsed?: boolean
      children?: React.ReactElement
      isFirst?: boolean
      isLast?: boolean
      parentNodeType?: ContainerNodeType
    } & NodeProps
  ) => JSX.Element
}

export interface ParallelNodeContent<T = any> {
  containerType: ContainerNode.parallel
  type: string
  component: (
    props: {
      node: ParallelNodeInternalType<T>
      collapsed?: boolean
      children?: React.ReactElement
      isFirst?: boolean
      isLast?: boolean
      parentNodeType?: ContainerNodeType
    } & NodeProps
  ) => JSX.Element
}

export type NodeContent = LeafNodeContent | SerialNodeContent | ParallelNodeContent
