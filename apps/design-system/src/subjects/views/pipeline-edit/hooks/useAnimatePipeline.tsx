import { useEffect, useState } from 'react'

import { AnyContainerNodeType } from '@harnessio/pipeline-graph'

import { PipelineNodeStatus } from '../nodes/types'

export const useAnimatePipeline = ({
  nodes,
  delay = 1
}: {
  nodes: AnyContainerNodeType[]
  delay?: number
}): { nodes: AnyContainerNodeType[] } => {
  const [animatedNodes, setAnimatedNodes] = useState<AnyContainerNodeType[]>(nodes)

  useEffect(() => {
    if (!animatedNodes.length) return

    let index = 0

    const processNext = () => {
      if (index >= animatedNodes.length) return

      // Ensure that 'data' is an object and exists before spreading
      const updatedNodes = [...animatedNodes]
      const nodeData = updatedNodes[index].data ?? {} // Fallback to empty object if 'data' is null or undefined
      updatedNodes[index].data = { ...nodeData, state: PipelineNodeStatus.Executing }

      setAnimatedNodes(updatedNodes)

      setTimeout(() => {
        // Ensure that 'data' is an object before modifying
        const updatedData = updatedNodes[index].data ?? {} // Fallback to empty object
        updatedNodes[index].data = { ...updatedData, state: PipelineNodeStatus.Success }
        setAnimatedNodes([...updatedNodes])

        index++
        processNext() // Move to next node
      }, delay * 1000)
    }

    processNext() // Start execution
  }, [nodes, delay])

  return { nodes: animatedNodes }
}
