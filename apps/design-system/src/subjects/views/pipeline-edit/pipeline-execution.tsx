import { useMemo } from 'react'

import { CollapseButton } from '@subjects/views/pipeline-edit/pipeline-nodes/components/collapse-button.tsx'

import { CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'
import { PipelineStudioNodeContextMenu, PipelineStudioNodeContextProvider } from '@harnessio/ui/views'

import { CanvasControls } from './canvas/canvas-controls'
import { useAnimatePipeline } from './hooks/useAnimatePipeline'
import { demoExecutionMock } from './mocks/animations/demoExecutionMock'
import { parallelContainerConfig, serialContainerConfig } from './mocks/pipelineExecutionMock'
import { contentNodeFactory } from './nodes-factory'
import CustomPort from './pipeline-nodes/components/custom-port'
import { GlobalData } from './types/common'

const globalDataConfigForExecution: GlobalData = {
  hideContextMenu: true,
  hideFloatingButtons: true
}

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
        globalData={globalDataConfigForExecution}
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
  const { nodes: animatedNodes } = useAnimatePipeline({ nodes: demoExecutionMock })

  return (
    <div className="relative flex  grow">
      <CanvasProvider config={{ maxScale: 1 }}>
        <PipelineGraph
          customCreateSVGPath={props => {
            const { id, path /*, pathLength, targetNode*/ } = props
            // TODO
            const pathStyle = ` stroke="hsl(var(--canary-border-03))"`
            const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`
            return { level1: staticPath, level2: '' }
          }}
          portComponent={CustomPort}
          collapseButtonComponent={CollapseButton}
          edgesConfig={{ radius: 10, parallelNodeOffset: 10, serialNodeOffset: 10 }}
          data={animatedNodes}
          nodes={nodes}
          serialContainerConfig={serialContainerConfig}
          parallelContainerConfig={parallelContainerConfig}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
