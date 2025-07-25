import { useEffect, useState } from 'react'

import { Layout, Text } from '@/components'
import { get } from 'lodash-es'
import { parse } from 'yaml'

import { AnyContainerNodeType } from '@harnessio/pipeline-graph'

import '@harnessio/pipeline-graph/dist/index.css'

import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { RightDrawer } from '@views/unified-pipeline-studio/types/right-drawer-types'

interface Stage {
  name: string
  steps?: Record<string, unknown>[]
  service?: string
  environment?: {
    id: string
    ['deploy-to']?: string
  }
}

export const PipelineStudioGraphViewStageDetailsSection = ({
  data: _data
}: {
  data: AnyContainerNodeType[]
}): React.ReactElement => {
  const { selectedPath, yamlRevision, setEditStageIntention, setRightDrawer } = useUnifiedPipelineStudioContext()
  const [stage, setStage] = useState<Stage>()

  useEffect(() => {
    if (!selectedPath?.stages) return setStage(undefined)
    try {
      const yamlJson = parse(yamlRevision.yaml)
      setStage(get(yamlJson, selectedPath.stages))
    } catch {
      setStage(undefined)
    }
  }, [selectedPath?.stages, yamlRevision])

  const renderDetail = (label: string, value: string | number) => (
    <Layout.Flex direction="column">
      <Text variant="body-normal" color="foreground-3">
        {label}
      </Text>
      <Text variant="body-normal" color="foreground-1">
        {value}
      </Text>
    </Layout.Flex>
  )

  return (
    <Layout.Flex
      className="w-full justify-between items-center cursor-pointer"
      onClick={() => {
        setRightDrawer(RightDrawer.StageConfig)
        setEditStageIntention({ path: selectedPath?.stages || '' })
      }}
    >
      <Text variant="heading-subsection">{stage?.name}</Text>
      <Layout.Flex align="center" gap="xl">
        {stage?.steps?.length ? renderDetail('Steps', stage.steps.length) : null}
        {stage?.service ? renderDetail('Service', stage.service) : null}
        {stage?.environment?.id ? renderDetail('Env', stage.environment.id) : null}
        {stage?.environment?.['deploy-to'] ? renderDetail('Infra', stage.environment['deploy-to']) : null}
      </Layout.Flex>
    </Layout.Flex>
  )
}
