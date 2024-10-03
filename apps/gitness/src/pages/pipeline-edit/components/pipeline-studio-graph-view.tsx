import { useEffect, useState } from 'react'
import { parse } from 'yaml'
import { PipelineStudio, getNodesFromPipelineYaml, type Node } from '@harnessio/unified-pipeline'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { InteractionContextProvider } from '../context/InteractionContextProvider'

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
    <div className="flex h-full w-full">
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
