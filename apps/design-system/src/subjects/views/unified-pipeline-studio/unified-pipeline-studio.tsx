import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { UnifiedPipelineStudio, UnifiedPipelineStudioProps } from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor/dist/components/YamlEditor'

import { pipeline1 } from './mocks/pipeline'
import { useTemplateListStore } from './template-list.store'

const PipelineStudioViewWrapper = () => {
  const [yamlRevision, onYamlRevisionChange] = useState<YamlRevision>({ yaml: pipeline1 })
  const [selectedPath, onSelectedPathChange] = useState<string | undefined>()

  const [panelOpen, onPanelOpenChange] = useState<boolean>(true)
  const [errors, onErrorsChange] = useState<UnifiedPipelineStudioProps['errors']>({
    isYamlValid: true,
    problems: [],
    problemsCount: { all: 0, error: 0, info: 0, warning: 0 }
  })

  const [view, setView] = useState<UnifiedPipelineStudioProps['view']>('visual')

  return (
    <UnifiedPipelineStudio
      useTranslationStore={useTranslationStore}
      useTemplateListStore={useTemplateListStore}
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
      onYamlDownload={noop}
      isYamlDirty={true}
      onSave={noop}
      selectedPath={selectedPath}
      onSelectedPathChange={onSelectedPathChange}
      errors={errors}
      onErrorsChange={onErrorsChange}
      panelOpen={panelOpen}
      onPanelOpenChange={onPanelOpenChange}
      setView={setView}
      view={view}
    />
  )
}

export default PipelineStudioViewWrapper
