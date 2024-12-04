// store.ts

import { set as _set } from 'lodash-es'
import { Edge, Node } from 'reactflow'
import { create } from 'zustand'

import { DefaultNodeProps } from '../../components/Canvas/types'
import { dedupeEdges } from '../../components/Canvas/utils/EdgeUtils'
import { dedupeNodes, getNodeById } from '../../components/Canvas/utils/NodeUtils'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node) => void
  addNodes: (node: Node[]) => void
  addEdge: (edge: Edge) => void
  addEdges: (edges: Edge[]) => void
  deleteElements: (elementIds: string[]) => void
  updateNodes: ({
    updatedNodes,
    notifyParent,
    notifySiblings
  }: {
    updatedNodes: Node[]
    notifyParent?: boolean
    notifySiblings?: boolean
  }) => void
  notifyParentNode: (childNode: Node) => void
  notifySiblingNodes: (node: Node) => void
  updateEdges: (updatedEdges: Edge[]) => void
}

const useFlowStore = create<FlowState>((set, get) => ({
  /* Nodes */
  nodes: [],
  setNodes: nodes => set({ nodes }),
  addNode: node => set(state => ({ nodes: [...state.nodes, node] })),
  addNodes: nodes => set(state => ({ nodes: dedupeNodes([...state.nodes, ...nodes]) })),
  updateNodes: ({ updatedNodes, notifyParent, notifySiblings }) => {
    set(state => ({
      nodes: state.nodes.map(node => updatedNodes.find(updatedNode => updatedNode.id === node.id) || node)
    }))
    if (notifyParent) {
      updatedNodes.forEach(node => get().notifyParentNode(node))
    }
    if (notifySiblings) {
      updatedNodes.forEach(node => get().notifySiblingNodes(node))
    }
  },
  /* Notify Parent Node */
  notifyParentNode: updatedChildNode => {
    const state = get()
    if (updatedChildNode && updatedChildNode.parentNode) {
      const parentNode = getNodeById(state.nodes, updatedChildNode.parentNode)
      if (parentNode) {
        const updatedParentNode = _set(
          parentNode,
          'data.hasChanged',
          !(parentNode.data as DefaultNodeProps)?.hasChanged
        )
        set(state => ({
          nodes: state.nodes.map(node => (node.id === parentNode.id ? updatedParentNode : node))
        }))
      }
    }
  } /* Notify Sibling Nodes */,
  notifySiblingNodes: updatedNode => {
    const state = get()
    if (updatedNode.parentNode) {
      const siblings = state.nodes.filter(
        node => node.id !== updatedNode.id && node.parentNode === updatedNode.parentNode
      )
      const updatedSiblings = siblings.map(sibling =>
        _set(sibling, 'data.hasChanged', !(sibling.data as DefaultNodeProps)?.hasChanged)
      )
      set(state => ({
        nodes: state.nodes.map(node => updatedSiblings.find(updatedSibling => updatedSibling.id === node.id) || node)
      }))
    }
  },
  /* Edges */
  edges: [],
  addEdge: edge => set(state => ({ edges: [...state.edges, edge] })),
  addEdges: edges => set(state => ({ edges: dedupeEdges([...state.edges, ...edges]) })),
  setEdges: edges => set({ edges }),
  updateEdges: updatedEdges => {
    set(state => ({
      edges: state.edges.map(edge => updatedEdges.find(updatedEdge => updatedEdge.id === edge.id) || edge)
    }))
  },
  /* Common */
  deleteElements: elementIds => {
    set(state => ({
      nodes: state.nodes.filter(node => !elementIds.includes(node.id)),
      edges: state.edges.filter(edge => !elementIds.includes(edge.id))
    }))
  }
}))

export default useFlowStore
