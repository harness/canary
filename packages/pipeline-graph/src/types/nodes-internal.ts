import { ContainerNode, LeafContainerNodeType, ParallelContainerNodeType, SerialContainerNodeType } from './nodes'

interface NodeInternal {
  path: string
}

export interface LeafNodeInternalType<T = any> extends LeafContainerNodeType<T>, NodeInternal {
  containerType: ContainerNode.leaf
}

export interface ParallelNodeInternalType<T = any>
  extends Omit<ParallelContainerNodeType<T>, 'children'>,
    NodeInternal {
  containerType: ContainerNode.parallel
  children: AnyNodeInternal[]
}

export interface SerialNodeInternalType<T = any> extends Omit<SerialContainerNodeType<T>, 'children'>, NodeInternal {
  containerType: ContainerNode.serial
  children: AnyNodeInternal[]
}

export type AnyNodeInternal = LeafNodeInternalType | ParallelNodeInternalType | SerialNodeInternalType
