import { useTranslationStore } from '@utils/viewUtils'

import { UnifiedPipelineStudio } from '@harnessio/ui/views'

import { useTemplateListStore } from './template-list.store'
import { usePipelineStudioStore } from './unified-pipeline-studio.store'

const PipelineStudioViewWrapper = () => {
  return (
    <UnifiedPipelineStudio
      useUnifiedPipelineStudioStore={usePipelineStudioStore}
      useTranslationStore={useTranslationStore}
      useTemplateListStore={useTemplateListStore}
    />
  )
}

export default PipelineStudioViewWrapper
