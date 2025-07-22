import { useEffect, useState } from 'react'

import { parse } from 'yaml'

import { AnyContainerNodeType } from '@harnessio/pipeline-graph'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import { UnifiedPipelineStudioNodeContextProvider } from './graph-implementation/context/UnifiedPipelineStudioNodeContext'
import { AddNodeDataType } from './graph-implementation/nodes/add-content-node'
import { ContentNodeType } from './graph-implementation/types/content-node-type'
import { YamlEntityType } from './graph-implementation/types/yaml-entity-type'
import { endNode, startNode } from './graph-implementation/utils/start-end-nodes'
import { yaml2Nodes } from './graph-implementation/utils/yaml-to-pipeline-graph'
import { PipelineStudioGraphViewStageDetailsSection } from './split-view/unified-pipeline-studio-graph-stage-details-section'
import { PipelineStudioGraphViewStages } from './split-view/unified-pipeline-studio-graph-stages'
import { PipelineStudioGraphViewSteps } from './split-view/unified-pipeline-studio-graph-steps'
import { PipelineStudioGraphView } from './unified-pipeline-studio-graph-view'
import PipelineStudioLayout from './unified-pipeline-studio-layout'
import { PipelineStudioNodeContextMenu } from './unified-pipeline-studio-node-context-menu'
import { PipelineStudioYamlView } from './unified-pipeline-studio-yaml-view'

export default function PipelineStudioView() {
  const { view, splitView, yamlRevision, yamlParserOptions, selectedPath } = useUnifiedPipelineStudioContext()

  const [data, setData] = useState<AnyContainerNodeType[]>([])

  useEffect(() => {
    return () => {
      setData([])
    }
  }, [])

  useEffect(() => {
    const yamlJson = parse(yamlRevision.yaml)
    const newData = yaml2Nodes(yamlJson, yamlParserOptions)

    if (newData.length === 0) {
      newData.push({
        type: ContentNodeType.Add,
        data: {
          yamlChildrenPath: 'pipeline.stages',
          name: '',
          yamlEntityType: YamlEntityType.SerialStageGroup,
          yamlPath: ''
        } satisfies AddNodeDataType
      })
    }

    newData.unshift(startNode)
    newData.push(endNode)
    setData(newData)
  }, [yamlRevision])

  return view === 'visual' ? (
    <>
      {splitView ? (
        <PipelineStudioLayout.Split>
          <PipelineStudioLayout.SplitMain>
            <UnifiedPipelineStudioNodeContextProvider graph="stages">
              <PipelineStudioGraphViewStages data={data} />
              <PipelineStudioNodeContextMenu />
            </UnifiedPipelineStudioNodeContextProvider>
          </PipelineStudioLayout.SplitMain>
          {selectedPath?.stages ? (
            <PipelineStudioLayout.SplitDivider>
              <PipelineStudioGraphViewStageDetailsSection data={data} />
            </PipelineStudioLayout.SplitDivider>
          ) : (
            <></>
          )}
          <PipelineStudioLayout.SplitPanel open={true} defaultSize={50}>
            <UnifiedPipelineStudioNodeContextProvider graph="steps">
              <PipelineStudioGraphViewSteps data={data} />
              <PipelineStudioNodeContextMenu />
            </UnifiedPipelineStudioNodeContextProvider>
          </PipelineStudioLayout.SplitPanel>
        </PipelineStudioLayout.Split>
      ) : (
        <UnifiedPipelineStudioNodeContextProvider graph="onecanvas">
          <PipelineStudioGraphView data={data} />
          <PipelineStudioNodeContextMenu />
        </UnifiedPipelineStudioNodeContextProvider>
      )}
    </>
  ) : (
    <PipelineStudioYamlView />
  )
}
