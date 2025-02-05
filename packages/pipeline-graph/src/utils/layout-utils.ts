import { ContainerNode } from '../types/nodes'
import { AnyNodeInternal, ParallelNodeInternalType, SerialNodeInternalType } from '../types/nodes-internal'

export function getTreeDepth(node: AnyNodeInternal): number {
  if (node.containerType === ContainerNode.leaf) {
    return 1
  } else {
    let maxRet = 1
    node.children.forEach(item => {
      maxRet = Math.max(getTreeDepth(item), maxRet)
    })

    return maxRet + 1
  }
}

export function findAdjustment(
  node: AnyNodeInternal,
  serialGroupAdjustment: number,
  parallelGroupAdjustment: number,
  parent?: SerialNodeInternalType | ParallelNodeInternalType,
  adjustment = 0
): number {
  if ('children' in node && node.children[0]) {
    if (node.children[0].containerType === ContainerNode.serial) {
      return findAdjustment(
        node.children[0],
        serialGroupAdjustment,
        parallelGroupAdjustment,
        node,
        adjustment + serialGroupAdjustment
      )
    } else if (node.children[0].containerType === ContainerNode.parallel) {
      return findAdjustment(
        node.children[0],
        serialGroupAdjustment,
        parallelGroupAdjustment,
        node,
        adjustment + parallelGroupAdjustment
      )
    }
  }

  return adjustment
}

export function hasNodeGroup(node: SerialNodeInternalType | ParallelNodeInternalType): boolean {
  return node.children.some(item => 'children' in item)
}

export function hasNodeGroupAndDontHaveLeaf(node: SerialNodeInternalType | ParallelNodeInternalType): boolean {
  return node.children.some(item => 'children' in item)
}
