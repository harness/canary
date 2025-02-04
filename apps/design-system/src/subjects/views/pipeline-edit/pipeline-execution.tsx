import { useMemo } from 'react'

import { CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'
import { CanvasControls } from '@harnessio/ui/views'

import { PipelineStudioNodeContextProvider } from './context/pipeline-studio-node-context'
import { executionMock } from './mocks/pipelineExecutionMock'
import { contentNodeFactory } from './nodes-factory'

const PipelineExecution = () => {
  return (
    <div className="relative flex h-screen grow">
      <PipelineStudioNodeContextProvider
        onSelectIntention={() => {}}
        onAddIntention={() => {}}
        onEditIntention={() => {}}
        onDeleteIntention={() => {}}
        onRevealInYaml={() => {}}
      >
        <PipelineExecutionInner />
      </PipelineStudioNodeContextProvider>
    </div>
  )
}

export default PipelineExecution

const PipelineExecutionInner = () => {
  const nodes = useMemo(() => contentNodeFactory.getNodesDefinition(), [contentNodeFactory])

  return (
    <div className="relative flex h-screen grow">
      <CanvasProvider>
        <PipelineGraph data={executionMock} nodes={nodes} />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
