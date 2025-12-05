import { NodeContent } from '../types/node-content'
import { AnyContainerNodeType } from '../types/nodes'
import { AnyNodeInternal } from '../types/nodes-internal'

/** addPaths function mutates 'nodes' */
export function addPaths(
  nodes: AnyContainerNodeType[],
  nodesBank: Record<string, NodeContent>,
  parentPath: string,
  addUid: boolean
): AnyNodeInternal[] {
  const nodesInternal = nodes as AnyNodeInternal[]

  nodesInternal.map((node, idx) => {
    const currPath = `${parentPath}.children.${idx}`

    // set path and containerType
    node.path = currPath
    node.containerType = nodesBank[node.type].containerType

    if ('children' in node) {
      addPaths(node.children, nodesBank, currPath, addUid)
    }
  })

  return nodesInternal
}

/** split path of item to 1. path to array and 2. element index */
export function getPathPieces(path: string) {
  const peaces = path.split('.')

  if (peaces.length === 1) {
    return { index: parseInt(path) }
  }

  const index = parseInt(peaces.pop() as string)
  const arrayPath = peaces.join('.')

  return { arrayPath, index }
}

/**
 * Extracts initial collapsed state from nodes
 * Recursively traverses the tree and collects all nodes where
 * config?.initialCollapsed === true and containerType is 'serial' or 'parallel'
 */
export function extractInitialCollapsedState(nodes: AnyNodeInternal[]): Record<string, boolean> {
  const collapsedState: Record<string, boolean> = {}

  function traverse(nodes: AnyNodeInternal[]) {
    for (const node of nodes) {
      // Only serial and parallel containers support collapsing
      if (
        (node.containerType === 'serial' || node.containerType === 'parallel') &&
        node.config?.initialCollapsed === true &&
        node.path
      ) {
        collapsedState[node.path] = true
      }

      // Recursively process children
      if ('children' in node && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }

  traverse(nodes)
  return collapsedState
}
