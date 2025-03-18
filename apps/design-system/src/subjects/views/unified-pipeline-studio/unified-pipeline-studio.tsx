import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { UnifiedPipelineStudio } from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor/dist/components/YamlEditor'

import { pipeline1 } from './mocks/pipeline'
import { useTemplateListStore } from './template-list.store'
import { usePipelineStudioStore } from './unified-pipeline-studio.store'

const PipelineStudioViewWrapper = () => {
  const [yamlRevision, onYamlRevisionChange] = useState<YamlRevision>({ yaml: pipeline1 })

  return (
    <UnifiedPipelineStudio
      useUnifiedPipelineStudioStore={usePipelineStudioStore}
      useTranslationStore={useTranslationStore}
      useTemplateListStore={useTemplateListStore}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
      onYamlDownload={noop}
      isYamlDirty={true}
      onSave={noop}
    />
  )
}

export default PipelineStudioViewWrapper
