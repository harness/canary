import { useEffect, useState } from 'react'

import { TreeViewElement } from '@harnessio/ui/components'
import { ExecutionState, LivelogLine } from '@harnessio/ui/views'

interface UseAnimateTreeProps {
  nodes: TreeViewElement[]
  logs: LivelogLine[]
  delay?: number
}

interface UseAnimatePipelineReturnType {
  currentNode: TreeViewElement | null
  updatedElements: TreeViewElement[]
}

export const useAnimateTree = ({ nodes, logs, delay = 15 }: UseAnimateTreeProps): UseAnimatePipelineReturnType => {
  const [updatedNodes, setUpdatedNodes] = useState<TreeViewElement[]>(nodes)
  const [currentNode, setCurrentNode] = useState<TreeViewElement | null>(null)

  useEffect(() => {
    let currentParentIndex = 0
    let currentChildIndex = 0

    // Helper function to mark a parent as RUNNING
    const markParentRunning = (parentNode: TreeViewElement) => {
      parentNode.status = ExecutionState.RUNNING
      setCurrentNode(parentNode)
    }

    // Process children and update status
    const processChildren = (parentNode: TreeViewElement): TreeViewElement => {
      const updatedChildren =
        parentNode.children?.map((child, index) => {
          if (index === currentChildIndex) {
            return { ...child, status: ExecutionState.RUNNING }
          }

          if (index < currentChildIndex) {
            return { ...child, status: ExecutionState.SUCCESS }
          }

          return child
        }) || []

      const allChildrenSuccess = updatedChildren.every(child => child.status === ExecutionState.SUCCESS)

      const updatedParentNode = {
        ...parentNode,
        children: updatedChildren,
        status: allChildrenSuccess ? ExecutionState.SUCCESS : parentNode.status
      }

      setUpdatedNodes(prevState => {
        const newNodes = [...prevState]
        newNodes[currentParentIndex] = updatedParentNode
        return newNodes
      })

      return updatedParentNode
    }

    const intervalId = setInterval(() => {
      if (currentParentIndex < nodes.length) {
        const parentNode = nodes[currentParentIndex]

        // Mark parent as RUNNING when processing starts or after its children are processed
        if (parentNode.status !== ExecutionState.RUNNING && currentChildIndex === 0) {
          markParentRunning(parentNode)
        }

        if (parentNode.children && parentNode.children.length > 0) {
          processChildren(parentNode)

          if (currentChildIndex < parentNode.children.length) {
            currentChildIndex++
          } else {
            currentChildIndex = 0
            currentParentIndex++
            if (currentParentIndex < nodes.length) {
              markParentRunning(nodes[currentParentIndex])
            }
          }
        } else {
          currentParentIndex++
          if (currentParentIndex < nodes.length) {
            markParentRunning(nodes[currentParentIndex])
          }
        }
      }
    }, delay * 1000) // Adjust interval based on desired speed

    return () => clearInterval(intervalId) // Cleanup on component unmount
  }, [nodes, logs]) // Added currentLogsMap to dependencies

  return {
    currentNode,
    updatedElements: updatedNodes
  }
}
