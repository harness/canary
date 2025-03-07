import { Canvas } from './components/canvas/canvas'
import GraphProvider from './context/graph-provider'
import PipelineGraphInternal, { PipelineGraphInternalProps } from './pipeline-graph-internal'
import { NodeContent } from './types/node-content'

import './pipeline-graph.css'

import ContainerNodeProvider, { ContainerNodeProviderProps } from './context/container-node-provider'
import { ParallelContainerConfig, SerialContainerConfig } from './types/container-node'

export interface PipelineGraphProps
  extends PipelineGraphInternalProps,
    Pick<ContainerNodeProviderProps, 'portComponent' | 'collapseButtonComponent'> {
  nodes: NodeContent[]
  serialContainerConfig?: Partial<SerialContainerConfig>
  parallelContainerConfig?: Partial<ParallelContainerConfig>
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
    collapseButtonComponent
  } = props

  return (
    <GraphProvider nodes={nodes}>
      <ContainerNodeProvider
        serialContainerConfig={serialContainerConfig}
        parallelContainerConfig={parallelContainerConfig}
        portComponent={portComponent}
        collapseButtonComponent={collapseButtonComponent}
      >
        <Canvas>
          <PipelineGraphInternal
            data={data}
            config={config}
            customCreateSVGPath={customCreateSVGPath}
            edgesConfig={edgesConfig}
          />
        </Canvas>
      </ContainerNodeProvider>
    </GraphProvider>
  )
}
