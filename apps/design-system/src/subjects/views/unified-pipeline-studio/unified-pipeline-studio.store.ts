import { useState } from 'react'

import { IUnifiedPipelineStudioStore } from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor/dist/components/YamlEditor'

import { pipeline1 } from './mocks/pipeline'

export const usePipelineStudioStore = (): IUnifiedPipelineStudioStore => {
  const [selectedPath, onSelectedPathChange] = useState<string | undefined>()
  const [yamlRevision, onYamlRevisionChange] = useState<YamlRevision>({ yaml: pipeline1 })
  const [panelOpen, onPanelOpenChange] = useState<boolean>(true)
  const [errors, onErrorsChange] = useState<IUnifiedPipelineStudioStore['errors']>({
    isYamlValid: true,
    problems: [],
    problemsCount: { all: 0, error: 0, info: 0, warning: 0 }
  })

  return {
    yamlRevision,
    onYamlRevisionChange,
    selectedPath,
    onSelectedPathChange,
    errors,
    onErrorsChange,
    panelOpen,
    onPanelOpenChange
  }
}
