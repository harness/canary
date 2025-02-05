import { Canvas } from './components/canvas/canvas'
import GraphProvider from './context/graph-provider'
import PipelineGraphInternal, { PipelineGraphInternalProps } from './pipeline-graph-internal'
import { NodeContent } from './types/node-content'

import './pipeline-graph.css'

import ContainerNodeProvider from './context/container-node-provider'
import { ParallelContainerConfig, SerialContainerConfig } from './types/container-node'

export interface PipelineGraphProps extends PipelineGraphInternalProps {
  nodes: NodeContent[]
  serialContainerConfig?: Partial<SerialContainerConfig>
  parallelContainerConfig?: Partial<ParallelContainerConfig>
}

export function PipelineGraph(props: PipelineGraphProps) {
  const { data, nodes, config, serialContainerConfig, parallelContainerConfig, customCreateSVGPath } = props

  return (
    <GraphProvider nodes={nodes}>
      <ContainerNodeProvider
        serialContainerConfig={serialContainerConfig}
        parallelContainerConfig={parallelContainerConfig}
      >
        <Canvas>
          <PipelineGraphInternal data={data} config={config} customCreateSVGPath={customCreateSVGPath} />
        </Canvas>
      </ContainerNodeProvider>
    </GraphProvider>
  )
}
