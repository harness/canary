import { useMemo } from 'react'

import { AnyContainerNodeType, CanvasProvider, PipelineGraph } from '@harnessio/pipeline-graph'
import { PipelineNodesComponents } from '@harnessio/ui/components'

import { CanvasControls } from './graph-implementation/canvas/canvas-controls'

import '@harnessio/pipeline-graph/dist/index.css'

import { parallelContainerConfig, serialContainerConfig } from './graph-implementation/config/config'
import { contentNodeBank } from './graph-implementation/factory/content-node-bank'

export const PipelineStudioGraphView = ({ data }: { data: AnyContainerNodeType[] }): React.ReactElement => {
  const nodes = useMemo(() => {
    return contentNodeBank.getNodesDefinition()
  }, [])

  return (
    <div className="bg-cn-graph-bg-gradient cn-graph-bg-size relative flex h-full grow">
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
