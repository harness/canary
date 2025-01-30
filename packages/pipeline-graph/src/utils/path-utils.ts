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
