import { useEffect, useState } from 'react'

import { parse } from 'yaml'

import { getNodesFromPipelineYaml, PipelineStudio, type Node } from '@harnessio/unified-pipeline'

import { InteractionContextProvider } from '../context/InteractionContextProvider'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'

export const PipelineStudioGraphView = (): React.ReactElement => {
  const {
    state: { yamlRevision },
    setEditStepIntention
  } = usePipelineDataContext()
  const { setStepDrawerOpen } = usePipelineViewContext()

  const [nodes, setNodes] = useState<Node[]>([])

  useEffect(() => {
    return () => {
      setNodes([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const nodes: Node[] = getNodesFromPipelineYaml(yamlJson)
    setNodes(nodes)
  }, [yamlRevision])

  return (
    <div className="flex size-full">
      <InteractionContextProvider>
        <PipelineStudio
          nodes={nodes}
          onAddNode={() => {}}
          onDeleteNode={() => {}}
          onSelectNode={node => {
            if (node.type === 'atomic') {
              setStepDrawerOpen(StepDrawer.Form)
              setEditStepIntention({ path: node.data.path })
            }
          }}
        />
      </InteractionContextProvider>
    </div>
  )
}
