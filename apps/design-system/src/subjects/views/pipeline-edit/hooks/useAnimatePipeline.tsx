import { useEffect, useState } from 'react'

import { AnyContainerNodeType, ParallelContainerNodeType, SerialContainerNodeType } from '@harnessio/pipeline-graph'

import { PipelineNodeStatus } from '../nodes/types'

export const useAnimatePipeline = ({
  nodes,
  delay = 1
}: {
  nodes: AnyContainerNodeType[]
  delay?: number
}): { nodes: AnyContainerNodeType[] } => {
  const [animatedNodes, setAnimatedNodes] = useState<AnyContainerNodeType[]>(nodes)

  const updateNodeState = (node: AnyContainerNodeType, state: PipelineNodeStatus) => {
    node.data = { ...(node.data ?? {}), state }
  }

  const processParallelGroup = (node: ParallelContainerNodeType, callback: () => void) => {
    if (!node.children || node.children.length === 0) {
      callback()
      return
    }

    let completedCount = 0
    node.children.forEach(child => {
      processStageOrStep(child, () => {
        completedCount++
        if (completedCount === node.children!.length) {
          updateNodeState(node, PipelineNodeStatus.Success)
          setAnimatedNodes([...animatedNodes])
          callback()
        }
      })
    })
  }

  const processSerialGroup = (node: SerialContainerNodeType, callback: () => void) => {
    if (!node.children || node.children.length === 0) {
      callback()
      return
    }

    const processNext = (index: number) => {
      if (index >= node.children!.length) {
        updateNodeState(node, PipelineNodeStatus.Success)
        setAnimatedNodes([...animatedNodes])
        callback()
        return
      }

      processStageOrStep(node.children![index], () => processNext(index + 1))
    }

    processNext(0)
  }

  const processStageOrStep = (node: AnyContainerNodeType, callback: () => void) => {
    updateNodeState(node, PipelineNodeStatus.Executing)
    setAnimatedNodes([...animatedNodes])

    setTimeout(() => {
      if (node.type === 'ParallelStageGroup') {
        processParallelGroup(node as ParallelContainerNodeType<unknown>, callback)
      } else if ((node as SerialContainerNodeType).children && (node as SerialContainerNodeType).children.length > 0) {
        processSerialGroup(node as SerialContainerNodeType, callback)
      } else {
        updateNodeState(node, PipelineNodeStatus.Success)
        setAnimatedNodes([...animatedNodes])
        callback()
      }
    }, delay * 1000)
  }

  useEffect(() => {
    if (animatedNodes.length === 0) return

    const processNext = (index: number) => {
      if (index >= animatedNodes.length) return
      processStageOrStep(animatedNodes[index], () => processNext(index + 1))
    }

    processNext(0)
  }, [nodes, delay])

  return { nodes: animatedNodes }
}
