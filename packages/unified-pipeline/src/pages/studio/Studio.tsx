import { Node as ReactFlowNode } from 'reactflow'

import demoPipeline from '../../assets/mockPipelines/yamls/demo_pipeline.yaml'
// import pipelineYamlSequentialGroup from '../../assets/mockPipelines/yamls/pipeline_w_sequential_stage_group.yaml'
import pipelineYamlParallelGroupAndStage from '../../assets/mockPipelines/yamls/pipeline_w_parallel_stage_group_and_stage.yaml'
import pipelineYamlParallelGroup from '../../assets/mockPipelines/yamls/pipeline_w_parallel_stage_group.yaml'
import pipelineYamlSingleStage from '../../assets/mockPipelines/yamls/pipeline_w_single_stage.yaml'
import { PipelineStudio } from '../../components/PipelineStudio/PipelineStudio'
import { getNodesFromPipelineYaml } from '../../utils/PipelineYamlUtils'

export const Studio: React.FC = () => {
  return (
    <PipelineStudio
      nodes={getNodesFromPipelineYaml(pipelineYamlSingleStage)}
      onAddNode={() => {}}
      onDeleteNode={() => {}}
      onSelectNode={() => {}}
    />
  )
}

export const StudioParallel: React.FC = () => {
  return (
    <PipelineStudio
      nodes={getNodesFromPipelineYaml(pipelineYamlParallelGroup)}
      onAddNode={(_addedNode: ReactFlowNode) => {}}
      onDeleteNode={() => {}}
      onSelectNode={() => {}}
    />
  )
}

export const StudioMixed: React.FC = () => {
  return (
    <PipelineStudio
      nodes={getNodesFromPipelineYaml(pipelineYamlParallelGroupAndStage)}
      onAddNode={() => {}}
      onDeleteNode={() => {}}
      onSelectNode={() => {}}
    />
  )
}

export const StudioDemo: React.FC = () => {
  return (
    <PipelineStudio
      nodes={getNodesFromPipelineYaml(demoPipeline)}
      onAddNode={() => {}}
      onDeleteNode={() => {}}
      onSelectNode={() => {}}
    />
  )
}
