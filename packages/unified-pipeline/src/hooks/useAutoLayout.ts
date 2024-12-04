import { useEffect } from 'react'

import { useNodesInitialized, useReactFlow, useStore, type Edge, type Node } from 'reactflow'

import { ExpandNodeProps } from '../components/Canvas/types'
import { performElkLayout } from '../components/Canvas/utils/ElkLayout'
import { getLayoutableNodes } from '../components/Canvas/utils/NodeUtils'

function useAutoLayout() {
  const { setNodes, setEdges } = useReactFlow()
  const nodesInitialized = useNodesInitialized()
  // Here we are storing a map of the nodes and edges in the flow. By using a
  // custom equality function as the second argument to `useStore`, we can make
  // sure the layout algorithm only runs when something has changed that should
  // actually trigger a layout change.
  const elements = useStore(
    state => ({
      nodeMap: state.nodeInternals,
      edgeMap: state.edges.reduce((acc, edge) => acc.set(edge.id, edge), new Map())
    }),
    // The compare elements function will only update `elements` if something has
    // changed that should trigger a layout. This includes changes to a node's
    // dimensions, the number of nodes, or changes to edge sources/targets.
    compareElements
  )

  useEffect(() => {
    // Only run the layout if there are nodes and they have been initialized with
    // their dimensions
    if (!nodesInitialized || elements.nodeMap.size === 0 || elements.edgeMap.size === 0) {
      return
    }

    // The callback passed to `useEffect` cannot be `async` itself, so instead we
    // create an async function here and call it immediately afterwards.
    const runLayout = async () => {
      const nodes = [...elements.nodeMap.values()]
      const edges = [...elements.edgeMap.values()]

      const { nodes: nextNodes, edges: nextEdges } = await performElkLayout({
        nodes: getLayoutableNodes(nodes),
        edges
      })
      setNodes(nextNodes)
      setEdges(nextEdges)
    }

    runLayout()
  }, [nodesInitialized, elements, setNodes, setEdges])
}

export default useAutoLayout

type Elements = {
  nodeMap: Map<string, Node>
  edgeMap: Map<string, Edge>
}

function compareElements(xs: Elements, ys: Elements) {
  return compareNodes(xs.nodeMap, ys.nodeMap) && compareEdges(xs.edgeMap, ys.edgeMap)
}

function compareNodes(xs: Map<string, Node>, ys: Map<string, Node>) {
  // the number of nodes changed, so we already know that the nodes are not equal
  if (xs.size !== ys.size) return false

  for (const [id, x] of xs.entries()) {
    const y = ys.get(id)

    // the node doesn't exist in the next state so it just got added
    if (!y) return false
    // We don't want to force a layout change while a user might be resizing a
    // node, so we only compare the dimensions if the node is not currently
    // being resized.
    //
    // We early return here instead of using a `continue` because there's no
    // scenario where we'd want nodes to start moving around *while* a user is
    // trying to resize a node or move it around.
    if (x.resizing || x.dragging) return true
    if (x.width !== y.width || x.height !== y.height) return false
    if ((x.data as ExpandNodeProps)?.expanded !== (y.data as ExpandNodeProps)?.expanded) return false
  }

  return true
}

function compareEdges(xs: Map<string, Edge>, ys: Map<string, Edge>) {
  // the number of edges changed, so we already know that the edges are not equal
  if (xs.size !== ys.size) return false

  for (const [id, x] of xs.entries()) {
    const y = ys.get(id)

    // the edge doesn't exist in the next state so it just got added
    if (!y) return false
    if (x.source !== y.source || x.target !== y.target) return false
    if (x?.sourceHandle !== y?.sourceHandle) return false
    if (x?.targetHandle !== y?.targetHandle) return false
  }

  return true
}
