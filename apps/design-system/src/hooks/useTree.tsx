import { useEffect, useState } from 'react'

import { TreeViewElement } from '@harnessio/ui/components'
import { ExecutionState } from '@harnessio/ui/views'

export const useTree = (
  nodes: TreeViewElement[],
  interval: number = 15
): { nodes: TreeViewElement[]; currentParent: TreeViewElement | null; currentChild: TreeViewElement | null } => {
  const [updatedNodes, setUpdatedNodes] = useState<TreeViewElement[]>(nodes)
  const [currentParent, setCurrentParent] = useState<TreeViewElement | null>(null)
  const [currentChild, setCurrentChild] = useState<TreeViewElement | null>(null)

  useEffect(() => {
    if (nodes.length === 0) return

    let currentNodeIndex = 0
    let currentChildIndex = 0

    // Immediately set the first parent node as "RUNNING" when processing starts
    const markParentRunning = (currentNode: TreeViewElement): void => {
      currentNode.status = ExecutionState.RUNNING
      setCurrentParent(currentNode)
    }

    // Process the current parent node and its children one by one
    const processChildren = (currentNode: TreeViewElement): TreeViewElement => {
      const updatedChildren =
        currentNode.children?.map((child: TreeViewElement, index: number) => {
          setCurrentChild(child)

          if (index === currentChildIndex) {
            return { ...child, status: ExecutionState.RUNNING }
          }

          if (index < currentChildIndex) {
            return {
              ...child,
              status: ExecutionState.SUCCESS,
              duration: `00:0${Math.floor(Math.random() * 10)}`
            }
          }

          return child
        }) || []

      const allChildrenSuccess = updatedChildren.every(
        (child: TreeViewElement) => child.status === ExecutionState.SUCCESS
      )

      const updatedNode = {
        ...currentNode,
        children: updatedChildren,
        status: allChildrenSuccess ? ExecutionState.SUCCESS : currentNode.status,
        duration: allChildrenSuccess ? `01:0${Math.floor(Math.random() * 10)}` : '--:--'
      }

      setUpdatedNodes(prevState => {
        const newNodes = [...prevState]
        newNodes[currentNodeIndex] = updatedNode
        return newNodes
      })

      return updatedNode
    }

    // Interval handler
    const intervalId = setInterval(() => {
      if (currentNodeIndex < nodes.length) {
        const currentNode = nodes[currentNodeIndex]

        // Mark parent as "RUNNING" immediately when starting or after its children are processed
        if (currentChildIndex === 0 && currentNode.status !== ExecutionState.RUNNING) {
          markParentRunning(currentNode)
        }

        if (currentNode.children && currentNode.children.length > 0) {
          // Process the children
          processChildren(currentNode)

          // Move to the next child or parent after children are processed
          if (currentChildIndex < currentNode.children.length) {
            currentChildIndex++
          } else {
            currentChildIndex = 0
            currentNodeIndex++
            // Move to the next parent and set it as "RUNNING"
            if (currentNodeIndex < nodes.length) {
              markParentRunning(nodes[currentNodeIndex])
            }
          }
        } else {
          // If no children, just move to the next node
          currentNodeIndex++
          if (currentNodeIndex < nodes.length) {
            markParentRunning(nodes[currentNodeIndex])
          }
        }
      }
    }, interval * 1000) // Convert seconds to milliseconds

    return () => clearInterval(intervalId) // Cleanup interval on component unmount or re-render
  }, [nodes, interval])

  return { nodes: updatedNodes, currentParent, currentChild }
}
