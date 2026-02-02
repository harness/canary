import { Canvas } from './components/canvas/canvas'
import GraphProvider, { GraphProviderProps } from './context/graph-provider'
import PipelineGraphInternal, { PipelineGraphInternalProps } from './pipeline-graph-internal'
import { NodeContent } from './types/node-content'

import './pipeline-graph.css'

import ContainerNodeProvider, { ContainerNodeProviderProps } from './context/container-node-provider'
import { ParallelContainerConfigType, SerialContainerConfigType } from './types/container-node'
import { useState } from 'react'

export interface PipelineGraphProps
  extends PipelineGraphInternalProps,
  Pick<ContainerNodeProviderProps, 'portComponent'> {
  nodes: NodeContent[]
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  collapsed?: GraphProviderProps['collapsed']
  collapse?: GraphProviderProps['collapse']
}

export function PipelineGraph(props: PipelineGraphProps) {
  const {
    data,
    nodes,
    config,
    serialContainerConfig,
    parallelContainerConfig,
    customCreateSVGPath,
    edgesConfig,
    portComponent,
    layout,
    getPort,
    collapsed = {},
    collapse = () => undefined
  } = props

  const [showSvg, setShowSvg] = useState(true)


  return (
    <GraphProvider nodes={nodes} collapsed={collapsed} collapse={collapse} setShowSvg={setShowSvg}>
      <ContainerNodeProvider
        serialContainerConfig={serialContainerConfig}
        parallelContainerConfig={parallelContainerConfig}
        portComponent={portComponent}
        layout={layout}
      >
        <Canvas>
          <PipelineGraphInternal
            data={data}
            config={config}
            customCreateSVGPath={customCreateSVGPath}
            edgesConfig={edgesConfig}
            layout={layout}
            getPort={getPort}
            showSvg={showSvg}
          />
        </Canvas>
      </ContainerNodeProvider>
    </GraphProvider>
  )
}
