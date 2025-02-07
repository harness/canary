import { useEffect, useState } from 'react'

import { AnyContainerNodeType } from '@harnessio/pipeline-graph'

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

      // Mark node as 'executing'
      const updatedNodes = [...animatedNodes]
      updatedNodes[index].data = { ...updatedNodes[index].data, state: 'executing' }
      setAnimatedNodes(updatedNodes)

      setTimeout(() => {
        // Mark node as 'success' after delay
        updatedNodes[index].data.state = 'success'
        setAnimatedNodes([...updatedNodes])

        index++
        processNext() // Move to next node
      }, delay * 1000)
    }

    processNext() // Start execution
  }, [nodes, delay])

  return { nodes: animatedNodes }
}
