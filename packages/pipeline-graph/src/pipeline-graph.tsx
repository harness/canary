import { Canvas } from './components/canvas/canvas'
import GraphProvider from './context/graph-provider'
import PipelineGraphInternal, { PipelineGraphInternalProps } from './pipeline-graph-internal'
import { NodeContent } from './types/node-content'

import './pipeline-graph.css'

export interface PipelineGraphProps extends PipelineGraphInternalProps {
  nodes: NodeContent[]
}

export function PipelineGraph(props: PipelineGraphProps) {
  const { data, nodes, onAdd, onDelete, onSelect } = props

  return (
    <GraphProvider nodes={nodes}>
      <Canvas>
        <PipelineGraphInternal data={data} onAdd={onAdd} onDelete={onDelete} onSelect={onSelect} />
      </Canvas>
    </GraphProvider>
  )
}
