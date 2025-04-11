import { useState } from 'react'

import { noop, useTranslationStore } from '@utils/viewUtils'

import { Drawer } from '@harnessio/ui/components'
import { UnifiedPipelineStudio, UnifiedPipelineStudioProps } from '@harnessio/ui/views'
import { YamlRevision } from '@harnessio/yaml-editor/dist/components/YamlEditor'

import { pipeline1 } from './mocks/pipeline'
import RunPipelineDrawerContent from './run-pipeline-drawer-content'
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
  const [isYamlDirty, setYamlDirty] = useState(true)
  const [runPipelineOpen, setRunPipelineOpen] = useState(false)

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column', left: '1.25em' }}>
      <UnifiedPipelineStudio
        useTranslationStore={useTranslationStore}
        useTemplateListStore={useTemplateListStore}
        yamlRevision={yamlRevision}
        onYamlRevisionChange={onYamlRevisionChange}
        onYamlDownload={noop}
        isYamlDirty={isYamlDirty}
        onSave={() => setYamlDirty(false)}
        selectedPath={selectedPath}
        onSelectedPathChange={onSelectedPathChange}
        errors={errors}
        onErrorsChange={onErrorsChange}
        panelOpen={panelOpen}
        onPanelOpenChange={onPanelOpenChange}
        setView={setView}
        view={view}
        onRun={() => setRunPipelineOpen(true)}
      />
      <Drawer.Lazy
        unmountOnClose={true}
        open={runPipelineOpen}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setRunPipelineOpen(false)
          }
        }}
      >
        <RunPipelineDrawerContent onClose={() => setRunPipelineOpen(false)} />
      </Drawer.Lazy>
    </div>
  )
}

export default PipelineStudioViewWrapper
