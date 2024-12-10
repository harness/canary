import {
  ParallelNodeType,
  SerialNodeType,
  LeafNodeType,
  ContainerNode,
} from "./nodes";

interface NodeInternal {
  path: string;
  // uid: string;
}

export interface LeafNodeInternalType<T = {}>
  extends LeafNodeType,
    NodeInternal {
  containerType: ContainerNode.leaf;
}

export interface ParallelNodeInternalType<T = {}>
  extends Omit<ParallelNodeType, "children">,
    NodeInternal {
  containerType: ContainerNode.parallel;
  children: AnyNodeInternal[];
}

export interface SerialNodeInternalType<T = {}>
  extends Omit<SerialNodeType, "children">,
    NodeInternal {
  containerType: ContainerNode.serial;
  children: AnyNodeInternal[];
}

export type AnyNodeInternal =
  | LeafNodeInternalType
  | ParallelNodeInternalType
  | SerialNodeInternalType;
