import { ContainerNode } from './nodes'
import { LeafNodeInternalType, ParallelNodeInternalType, SerialNodeInternalType } from './nodes-internal'

export interface LeafNodeContent<T = {}> {
  containerType: ContainerNode.leaf
  type: string
  component: (props: { node: LeafNodeInternalType<T>; children: React.ReactElement }) => JSX.Element
}

export interface SerialNodeContent<T = {}> {
  containerType: ContainerNode.serial
  type: string
  component: (props: { node: SerialNodeInternalType<T>; children: React.ReactElement }) => JSX.Element
}

export interface ParallelNodeContent<T = {}> {
  containerType: ContainerNode.parallel
  type: string
  component: (props: { node: ParallelNodeInternalType<T>; children: React.ReactElement }) => JSX.Element
}

export type NodeContent = LeafNodeContent | SerialNodeContent | ParallelNodeContent
