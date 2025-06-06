import { Canvas } from './components/canvas/canvas'
import GraphProvider from './context/graph-provider'
import PipelineGraphInternal, { PipelineGraphInternalProps } from './pipeline-graph-internal'
import { NodeContent } from './types/node-content'

import './pipeline-graph.css'

import ContainerNodeProvider, { ContainerNodeProviderProps } from './context/container-node-provider'
import { ParallelContainerConfigType, SerialContainerConfigType } from './types/container-node'

export interface PipelineGraphProps
  extends PipelineGraphInternalProps,
    Pick<ContainerNodeProviderProps, 'portComponent' | 'collapseButtonComponent'> {
  nodes: NodeContent[]
  serialContainerConfig?: Partial<SerialContainerConfigType>
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
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
    collapseButtonComponent,
    layout
  } = props

  return (
    <GraphProvider nodes={nodes}>
      <ContainerNodeProvider
        serialContainerConfig={serialContainerConfig}
        parallelContainerConfig={parallelContainerConfig}
        portComponent={portComponent}
        collapseButtonComponent={collapseButtonComponent}
        layout={layout}
      >
        <Canvas>
          <PipelineGraphInternal
            data={data}
            config={config}
            customCreateSVGPath={customCreateSVGPath}
            edgesConfig={edgesConfig}
            layout={layout}
          />
        </Canvas>
      </ContainerNodeProvider>
    </GraphProvider>
  )
}
