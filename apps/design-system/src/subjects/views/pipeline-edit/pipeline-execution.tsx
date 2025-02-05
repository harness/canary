import { useMemo } from 'react'

import { CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'
import { CanvasControls, PipelineStudioNodeContextMenu, PipelineStudioNodeContextProvider } from '@harnessio/ui/views'

import { executionMock, parallelContainerConfig, serialContainerConfig } from './mocks/pipelineExecutionMock'
import { contentNodeFactory } from './nodes-factory'

const PipelineExecution = () => {
  return (
    <div className="relative flex h-screen grow">
      <PipelineStudioNodeContextProvider
        selectedPath={''}
        onAddIntention={() => undefined}
        onDeleteIntention={() => undefined}
        onEditIntention={() => undefined}
        onRevealInYaml={() => undefined}
        onSelectIntention={() => undefined}
      >
        <PipelineExecutionInner />
        <PipelineStudioNodeContextMenu />
      </PipelineStudioNodeContextProvider>
    </div>
  )
}

export default PipelineExecution

const PipelineExecutionInner = () => {
  const nodes = useMemo(() => contentNodeFactory.getNodesDefinition(), [contentNodeFactory])

  return (
    <div className="relative flex h-screen grow">
      <CanvasProvider config={{ maxScale: 1 }}>
        <PipelineGraph
          data={executionMock}
          nodes={nodes}
          serialContainerConfig={serialContainerConfig}
          parallelContainerConfig={parallelContainerConfig}
          customCreateSVGPath={props => {
            const { id, path, targetNode /* pathLength */ } = props

            const pathStyle = targetNode?.data.state === 'executed' ? ` stroke="#43b5e6"` : ` stroke="#5D5B65"`
            const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`

            // let animationPath: string = ''
            // if (targetNode?.data.state === 'executing') {
            //   animationPath = `<path d="${path}" id="${id}" fill="none" stroke="#43b5e6" class="PipelineGraph-AnimatePath" stroke-dasharray="${pathLength}" stroke-dashoffset="${pathLength}" />`
            // }

            return { level1: staticPath, level2: '' /* animationPath */ }
          }}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
