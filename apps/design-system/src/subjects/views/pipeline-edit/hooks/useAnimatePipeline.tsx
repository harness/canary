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
      updatedNodes[index].data = { ...(updatedNodes[index].data ?? {}), state: PipelineNodeStatus.Executing }

      setAnimatedNodes(updatedNodes)

      setTimeout(() => {
        updatedNodes[index].data = { ...(updatedNodes[index].data ?? {}), state: PipelineNodeStatus.Success }
        setAnimatedNodes([...updatedNodes])
        index++
        processNext() // Move to next node
      }, delay * 1000)
    }

    processNext() // Start execution
  }, [nodes, delay])

  return { nodes: animatedNodes }
}
