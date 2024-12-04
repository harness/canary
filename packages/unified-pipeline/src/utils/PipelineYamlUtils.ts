import { has, isEmpty, isUndefined } from 'lodash-es'
import { Position, XYPosition, type Node as ReactFlowNode } from 'reactflow'

import type { AtomicNodeProps } from '../components/Canvas/elements/Nodes/AtomicNode/AtomicNode'
import type { GroupNodeProps } from '../components/Canvas/elements/Nodes/GroupNode/GroupNode'
import type { PlusNodeProps } from '../components/Canvas/elements/Nodes/PlusNode/PlusNode'
import type { RootNodeProps } from '../components/Canvas/elements/Nodes/RootNode/RootNode'
import { Graph, Node, NodeType, PositionType } from '../components/Canvas/types'
import { DEFAULT_NODE_LOCATION, PLUS_NODE_ID, ROOT_NODE_ID } from '../components/Canvas/utils/LROrientation/Constants'
import { sortNodes } from '../components/Canvas/utils/NodeUtils'
import { parsePipelineYaml, parseV0PipelineYaml } from './ParserUtils'
import { getIdFromName } from './StringUtils'

const STAGES_PATH = 'stages'
const PIPELINE_STAGES_PATH = `pipeline.${STAGES_PATH}`
const BASE_Z_INDEX = 1

const RootNode: ReactFlowNode = {
  id: ROOT_NODE_ID,
  type: NodeType.ROOT,
  data: {
    expandable: false,
    expanded: true,
    positionType: PositionType.ABSOLUTE
  } as RootNodeProps,
  selectable: false,
  position: DEFAULT_NODE_LOCATION,
  draggable: false,
  connectable: false /* No node other than the one specified should be able to connect to "root" node */
}

const getPlusNode = ({
  pathPrefix,
  targetPosition
}: {
  pathPrefix: string
  targetPosition: Position
}): ReactFlowNode => {
  return {
    id: PLUS_NODE_ID,
    type: NodeType.PLUS,
    position: DEFAULT_NODE_LOCATION,
    data: {
      nodeType: NodeType.STAGE,
      positionType: PositionType.ABSOLUTE,
      path: pathPrefix,
      targetPosition
    } as PlusNodeProps,
    selectable: true,
    draggable: false,
    connectable: false /* No node other than the one specified should be able to connect to "plus" node */
  }
}

const getGroupNode = ({
  node,
  memberNodes,
  readonly
}: {
  node: Node
  memberNodes: ReactFlowNode[]
  readonly?: boolean
}): ReactFlowNode => {
  return {
    id: getIdFromName(node.name),
    data: {
      icon: node.icon,
      name: node.name,
      path: node.path,
      memberNodes,
      positionType: PositionType.ABSOLUTE,
      expandable: node.expandable,
      expanded: true,
      deletable: true,
      parallel: node.parallel,
      groupId: node.groupId,
      readonly
    } as GroupNodeProps,
    position: DEFAULT_NODE_LOCATION,
    type: NodeType.GROUP,
    selectable: true
  }
}

/* Member of a group can be either an Atomic node or a Group node itself*/
const getGroupMemberNode = ({
  nodeType,
  memberNode,
  childNodes,
  groupId,
  pathPrefix,
  position = DEFAULT_NODE_LOCATION,
  hidden = false,
  readonly,
  zIndex = 1
}: {
  nodeType: NodeType
  memberNode: Node
  pathPrefix: string
  childNodes?: ReactFlowNode[]
  groupId?: string
  position?: XYPosition
  hidden?: boolean
  readonly?: boolean
  zIndex?: number
}): ReactFlowNode => {
  return {
    id: getIdFromName(memberNode.name),
    data: {
      icon: memberNode.icon,
      name: memberNode.name,
      path: pathPrefix,
      memberNodes: childNodes,
      positionType: groupId ? PositionType.RELATIVE : PositionType.ABSOLUTE,
      expandable: memberNode.expandable,
      expanded: true,
      deletable: true,
      parallel: memberNode.parallel,
      readonly
    } as GroupNodeProps,
    position,
    type: nodeType,
    selectable: true,
    connectable: !memberNode.parallel,
    ...(groupId && { parentNode: groupId, extent: 'parent', zIndex }),
    hidden
  }
}

const isGroupNode = (node: Node): boolean => {
  return has(node, 'groupId') && !isEmpty(node.groupId) && !isEmpty(node.children)
}

export const getElementsFromGraph = ({
  nodes: initialNodes,
  readonly
}: {
  nodes: Graph['nodes']
  readonly?: boolean
}): ReactFlowNode[] => {
  if (initialNodes.length === 0) return []
  const nodes: ReactFlowNode[] = [RootNode]
  initialNodes.forEach((node: Node) => {
    nodes.push(...processNode({ node, readonly, zIndex: BASE_Z_INDEX }))
  })
  nodes.push({
    ...getPlusNode({
      pathPrefix: '',
      targetPosition: Position.Left
    }),
    position: DEFAULT_NODE_LOCATION
  })
  return nodes
}

const processNode = ({
  node,
  readonly,
  zIndex = 1
}: {
  node: Node
  nodeIdx?: number
  readonly?: boolean
  zIndex?: number
}): ReactFlowNode[] => {
  const nodes: ReactFlowNode[] = []
  /* Node is itself a group node */
  if (isGroupNode(node)) {
    const parentNodeId = node.groupId || ''
    const stageNodes: ReactFlowNode[] = []
    const groupChildNodes = node.children
    groupChildNodes?.forEach((groupChildNode: Node, groupChildNodeIdx: number) => {
      if (isGroupNode(groupChildNode)) {
        // Recursive call for group node child
        const childNodes = processNode({
          node: groupChildNode,
          nodeIdx: groupChildNodeIdx,
          readonly,
          zIndex: zIndex + 1
        })
        nodes.push(...childNodes)
      } else {
        const atomicNodes: ReactFlowNode[] = []
        if (groupChildNode.children && groupChildNode.children?.length > 0) {
          const stepNodes = groupChildNode.children
          stepNodes.forEach((stepNode: Node, stepNodeIdx: number) => {
            // check if it is atomic step node or step group
            const isStepGroup = isGroupNode(stepNode)
            // if step group process with container else atomic
            if (isStepGroup) {
              const atomicStepNodes: ReactFlowNode[] = []
              atomicStepNodes.push(
                ...getAtomicNodesForContainer({
                  stageNode: stepNode,
                  readonly,
                  zIndex: zIndex + 2
                })
              )
              nodes.push(...atomicStepNodes)
              const stepGroupContainerNode = getGroupMemberNode({
                nodeType: NodeType.STAGE,
                memberNode: stepNode,
                childNodes: atomicStepNodes,
                groupId: groupChildNode.name,
                pathPrefix: '',
                position: DEFAULT_NODE_LOCATION,
                readonly
              })
              atomicNodes.push(stepGroupContainerNode)
            } else {
              atomicNodes.push(
                getAtomicStepNode({
                  parentNode: groupChildNode,
                  stepNode: stepNode,
                  stepNodeIdx: stepNodeIdx,
                  readonly,
                  zIndex: zIndex + 1
                })
              )
            }
          })
          // atomicNodes.push(
          //   ...getAtomicNodesForContainer({
          //     stageNode: groupChildNode,
          //     readonly,
          //     zIndex: zIndex + 1
          //   })
          // )
        }
        const containerNode = getGroupMemberNode({
          nodeType: NodeType.STAGE,
          memberNode: groupChildNode,
          childNodes: atomicNodes,
          groupId: parentNodeId,
          pathPrefix: '',
          position: DEFAULT_NODE_LOCATION,
          readonly
        })
        stageNodes.push(containerNode)
        nodes.push(...[containerNode, ...atomicNodes].sort(sortNodes))
      }
    })
    nodes.push(
      getGroupNode({
        node,
        memberNodes: stageNodes,
        readonly
      })
    )
  } else {
    const atomicNodes: ReactFlowNode[] = []
    if (node.children && node.children?.length > 0) {
      atomicNodes.push(
        ...getAtomicNodesForContainer({
          stageNode: node,
          readonly
        })
      )
    }
    const containerNode = getGroupMemberNode({
      nodeType: NodeType.STAGE,
      memberNode: node,
      childNodes: atomicNodes,
      pathPrefix: node.path,
      position: DEFAULT_NODE_LOCATION,
      readonly
    })
    nodes.push(...[containerNode, ...atomicNodes].sort(sortNodes))
  }
  return nodes
}

export const getStepNodePath = (stageNodePath: string, stepIndex: number) => `${stageNodePath}.steps.${stepIndex}`

/**
 *
 * @param stageNode
 * @param hidden - To hide children by default. In step group view, stage nodes should be rendered in the collapsed view by default.
 * @returns
 */
export const getAtomicNodesForContainer = ({
  stageNode,
  hidden = false,
  readonly,
  zIndex = 1
}: {
  stageNode: Node
  hidden?: boolean
  readonly?: boolean
  zIndex?: number
}): ReactFlowNode[] => {
  if (!stageNode || !stageNode.children) {
    return []
  }
  const parentNodeId = getIdFromName(stageNode.name)
  const childNodes: ReactFlowNode[] = []
  childNodes.push(
    ...(stageNode.children.map((stepNode: Node, stepNodeIdx: number) => {
      const id = getIdFromName(`${stageNode.name} child ${stepNodeIdx + 1}`)
      return {
        id,
        data: {
          name: stepNode.name,
          icon: stepNode.icon,
          path: getStepNodePath(stageNode.path, stepNodeIdx),
          expandable: stepNode.expandable,
          positionType: PositionType.RELATIVE,
          deletable: true,
          readonly,
          parallel: stepNode.parallel
        } as AtomicNodeProps,
        position: DEFAULT_NODE_LOCATION,
        type: NodeType.ATOMIC,
        selectable: true,
        parentNode: parentNodeId,
        extent: 'parent',
        zIndex,
        hidden
      }
    }) as ReactFlowNode<AtomicNodeProps>[])
  )
  /**
   * Sorting nodes after adding a child node inside a parent is important, see below issue for more details:
   * https://github.com/xyflow/xyflow/issues/3041#issuecomment-1550978610
   */
  return childNodes.sort(sortNodes)
}

export const getAtomicStepNode = ({
  parentNode,
  stepNode,
  stepNodeIdx,
  hidden = false,
  readonly,
  zIndex = 1
}: {
  parentNode: Node
  stepNode: Node
  stepNodeIdx: number
  hidden?: boolean
  readonly?: boolean
  zIndex?: number
}): ReactFlowNode => {
  const parentNodeId = getIdFromName(parentNode.name)
  const id = getIdFromName(`${parentNode.name} child ${stepNodeIdx + 1}`)
  return {
    id,
    data: {
      name: stepNode.name,
      icon: stepNode.icon,
      path: getStepNodePath(parentNode.path, stepNodeIdx),
      expandable: stepNode.expandable,
      positionType: PositionType.RELATIVE,
      deletable: true,
      readonly,
      parallel: stepNode.parallel
    } as AtomicNodeProps,
    position: DEFAULT_NODE_LOCATION,
    type: NodeType.ATOMIC,
    selectable: true,
    parentNode: parentNodeId,
    extent: 'parent',
    zIndex,
    hidden
  }
}

export const getNodesFromPipelineYaml = (pipelineYamlAsObject: Record<string, any>): Graph['nodes'] => {
  if (
    !pipelineYamlAsObject ||
    isEmpty(pipelineYamlAsObject) ||
    isUndefined(pipelineYamlAsObject) ||
    !has(pipelineYamlAsObject, PIPELINE_STAGES_PATH)
  )
    return []
  return parsePipelineYaml({
    yamlObject: pipelineYamlAsObject,
    pathPrefix: PIPELINE_STAGES_PATH
  })
}

export const getNodesFromV0PipelineYaml = (pipelineYamlAsObject: Record<string, any>): Graph['nodes'] => {
  if (
    !pipelineYamlAsObject ||
    isEmpty(pipelineYamlAsObject) ||
    isUndefined(pipelineYamlAsObject) ||
    !has(pipelineYamlAsObject, PIPELINE_STAGES_PATH)
  )
    return []
  return parseV0PipelineYaml({
    yamlObject: pipelineYamlAsObject,
    pathPrefix: PIPELINE_STAGES_PATH
  })
}
