import { useEffect, useState } from 'react'

import { Layout, Text } from '@/components'

import { AnyContainerNodeType } from '@harnessio/pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { get } from 'lodash-es'
import { parse } from 'yaml'

interface Stage {
  name: string
  steps: Record<string, unknown>[]
}

export const PipelineStudioGraphViewStageDetailsSection = ({
  data: _data
}: {
  data: AnyContainerNodeType[]
}): React.ReactElement => {
  const { selectedPath, yamlRevision } = useUnifiedPipelineStudioContext()
  const [stage, setStage] = useState<Stage>()

  useEffect(() => {
    if (!selectedPath?.stages) {
      setStage(undefined)
      return
    }
    try {
      const yamlJson = parse(yamlRevision.yaml)
      const stageData = get(yamlJson, selectedPath.stages)
      setStage(stageData)
    } catch {
      setStage(undefined)
    }
  }, [selectedPath?.stages, yamlRevision])

  const service = get(stage, 'service', '')
  const env = get(stage, 'environment.id', '')
  const infra = get(stage, 'environment.deploy-to', '')

  return (
    <Layout.Flex className="border-t border-cn-borders-2 h-16 justify-between items-center px-4 cursor-pointer">
      <Text variant="heading-subsection">{stage?.name}</Text>
      <Layout.Flex align="center" gap="lg">
        {stage?.steps?.length ? (
          <Layout.Flex direction="column">
            <Text>Steps</Text>
            <Text>{stage.steps.length}</Text>
          </Layout.Flex>
        ) : null}
        {service && (
          <Layout.Flex direction="column">
            <Text>Service</Text>
            <Text>{service}</Text>
          </Layout.Flex>
        )}
        {env && (
          <Layout.Flex direction="column">
            <Text>Env</Text>
            <Text>{env}</Text>
          </Layout.Flex>
        )}
        {infra && (
          <Layout.Flex direction="column">
            <Text>Infra</Text>
            <Text>{infra}</Text>
          </Layout.Flex>
        )}
      </Layout.Flex>
    </Layout.Flex>
  )
}
