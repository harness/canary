import { useMemo } from 'react'

import { PipelineNodesComponents } from '@/components'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'

import { CanvasControls } from '../graph-implementation/canvas/canvas-controls'

import '@harnessio/pipeline-graph/dist/index.css'

import { parallelContainerConfig, serialContainerConfig } from '../graph-implementation/config/config'
import { splitView_contentNodeBank } from '../graph-implementation/factory/splitview-content-node-bank'

export const PipelineStudioGraphViewStages = ({ data }: { data: AnyContainerNodeType[] }): React.ReactElement => {
  const nodes = useMemo(() => {
    return splitView_contentNodeBank.getNodesDefinition()
  }, [])

  return (
    <div className="relative flex h-full grow bg-graph-bg-gradient bg-graph-bg-size">
      <CanvasProvider>
        <PipelineGraph
          customCreateSVGPath={props => {
            const { id, path } = props
            const pathStyle = ` stroke="var(--cn-border-1)"`
            const staticPath = `<path d="${path}" id="${id}" fill="none" ${pathStyle} />`
            return { level1: staticPath, level2: '' }
          }}
          edgesConfig={{
            radius: 10,
            parallelNodeOffset: 10,
            serialNodeOffset: 10
          }}
          portComponent={PipelineNodesComponents.Port}
          collapseButtonComponent={PipelineNodesComponents.CollapseButton}
          serialContainerConfig={serialContainerConfig}
          parallelContainerConfig={parallelContainerConfig}
          data={data}
          nodes={nodes}
        />
        <CanvasControls />
      </CanvasProvider>
    </div>
  )
}
