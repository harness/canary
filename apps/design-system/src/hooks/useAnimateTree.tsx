import { useEffect, useState } from 'react'

import { TreeViewElement } from '@harnessio/ui/components'
import { ExecutionState } from '@harnessio/ui/views'

interface UseAnimateTreeProps {
  elements: TreeViewElement[]
  delay?: number
}

interface UseAnimatePipelineReturnType {
  currentNode: TreeViewElement | null
  updatedElements: TreeViewElement[]
}

export const useAnimateTree = ({ elements, delay = 15 }: UseAnimateTreeProps): UseAnimatePipelineReturnType => {
  const [updatedElements, setUpdatedElements] = useState<TreeViewElement[]>(elements)
  const [currentNode, setCurrentNode] = useState<TreeViewElement | null>(elements[0]) // by default, set the first node as currentNode

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
            setCurrentNode(child) // Set the running child as currentNode
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

      setUpdatedElements(prevState => {
        const newNodes = [...prevState]
        newNodes[currentParentIndex] = updatedParentNode
        return newNodes
      })

      return updatedParentNode
    }

    const intervalId = setInterval(() => {
      if (currentParentIndex < elements.length) {
        const parentNode = elements[currentParentIndex]

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
            parentNode.status = ExecutionState.SUCCESS // Mark parent as SUCCESS when all children are done
            currentParentIndex++
            if (currentParentIndex < elements.length) {
              markParentRunning(elements[currentParentIndex])
            }
          }
        } else {
          parentNode.status = ExecutionState.SUCCESS // Mark parent as SUCCESS if it has no children
          currentParentIndex++
          if (currentParentIndex < elements.length) {
            markParentRunning(elements[currentParentIndex])
          }
        }
      }
    }, delay * 1000) // Adjust interval based on desired speed

    return () => clearInterval(intervalId) // Cleanup on component unmount
  }, [elements])

  return {
    currentNode,
    updatedElements: updatedElements
  }
}
