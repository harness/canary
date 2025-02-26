import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { PipelineStudioGraphView } from './unified-pipeline-studio-graph-view'
import { PipelineStudioYamlView } from './unified-pipeline-studio-yaml-view'

export default function PipelineStudioView() {
  const { view } = useUnifiedPipelineStudioContext()

  return view === 'visual' ? <PipelineStudioGraphView /> : <PipelineStudioYamlView />
}
