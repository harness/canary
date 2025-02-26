import { useTranslationStore } from '@utils/viewUtils'

import { UnifiedPipelineStudio } from '@harnessio/ui/views'

import { usePipelineStudioStore } from './unified-pipeline-studio.store'

const PipelineStudioViewWrapper = () => {
  return (
    <UnifiedPipelineStudio
      useUnifiedPipelineStudioStore={usePipelineStudioStore}
      useTranslationStore={useTranslationStore}
    />
  )
}

export default PipelineStudioViewWrapper
