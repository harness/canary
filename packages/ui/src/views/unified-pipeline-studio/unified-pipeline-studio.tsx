import { InputFactory } from '@harnessio/forms'

import { TranslationStore } from '..'
import { UnifiedPipelineStudioNodeContextProvider } from './components/graph-implementation/context/UnifiedPipelineStudioNodeContext'
import { AnyStepDefinition } from './components/steps/types'
import { PipelineStudioNodeContextMenu } from './components/unified-pipeline-studio-node-context-menu'
import { YamlErrorDataType } from './components/unified-pipeline-studio-yaml-view'
import { VisualYamlValue } from './components/visual-yaml-toggle'
import { UnifiedPipelineStudioProvider } from './context/unified-pipeline-studio-context'
import { YamlRevision } from './types/common-types'
import { PipelineStudioInternal } from './unified-pipeline-studio-internal'

export interface ITemplateListItem {
  identifier: string
  description?: string
}

export interface ITemplateListStore {
  templates: ITemplateListItem[] | null
  setTemplatesData: (data: ITemplateListItem[] | null, totalPages: number) => void
  totalPages: number
  page: number
  xNextPage: number
  xPrevPage: number
  setPage: (page: number, query: string) => void
  getTemplateFormDefinition: (identifier: string) => Promise<any> // << TODO
}

export interface IUnifiedPipelineStudioStore {
  /** yaml state */
  yamlRevision: YamlRevision
  /** yaml change callback */
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  /** NOTE: selected node path may change on node deletion to keep same node selected */
  selectedPath?: string
  onSelectedPathChange: (path: string) => void
  /** yaml errors */
  errors: YamlErrorDataType
  onErrorsChange?: (errors: YamlErrorDataType) => void
  /** problems and other tabs open state */
  panelOpen: boolean
  onPanelOpenChange?: (open: boolean) => void
}

export interface UnifiedPipelineStudioProps {
  useUnifiedPipelineStudioStore: () => IUnifiedPipelineStudioStore
  useTemplateListStore: () => ITemplateListStore
  useTranslationStore: () => TranslationStore
  initialView?: VisualYamlValue
  // NOTE: new props - wip
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  onYamlDownload: (yaml: string) => void
  onSave: (yaml: string) => void
  isYamlDirty: boolean
  theme?: 'light' | 'dark' | string
  saveInProgress?: boolean
  loadInProgress?: boolean
  inputComponentFactory?: InputFactory
  stepsDefinitions?: AnyStepDefinition[]
  selectedPath?: string
  onSelectedPathChange: (path: string) => void
}

export const UnifiedPipelineStudio = (props: UnifiedPipelineStudioProps): JSX.Element => {
  const {
    useUnifiedPipelineStudioStore,
    initialView = 'visual',
    useTranslationStore,
    useTemplateListStore,
    yamlRevision,
    onYamlRevisionChange,
    onYamlDownload,
    isYamlDirty,
    onSave,
    theme,
    saveInProgress,
    loadInProgress,
    inputComponentFactory,
    stepsDefinitions,
    onSelectedPathChange,
    selectedPath
  } = props

  const { errors, onErrorsChange, panelOpen, onPanelOpenChange } = useUnifiedPipelineStudioStore()

  return (
    <UnifiedPipelineStudioProvider
      yamlRevision={yamlRevision}
      onYamlRevisionChange={yamlRevision => {
        onYamlRevisionChange(yamlRevision)
      }}
      onDownloadYaml={onYamlDownload}
      isYamlDirty={isYamlDirty}
      onSave={onSave}
      onSelectedPathChange={onSelectedPathChange}
      selectedPath={selectedPath}
      errors={errors}
      onErrorsChange={onErrorsChange}
      panelOpen={panelOpen}
      onPanelOpenChange={onPanelOpenChange}
      useTranslationStore={useTranslationStore}
      useTemplateListStore={useTemplateListStore}
      initialView={initialView}
      theme={theme}
      saveInProgress={saveInProgress}
      inputComponentFactory={inputComponentFactory}
      stepsDefinitions={stepsDefinitions}
    >
      <UnifiedPipelineStudioNodeContextProvider>
        {/* TODO: Loading... */}
        {loadInProgress ? 'Loading...' : <PipelineStudioInternal />}
        <PipelineStudioNodeContextMenu />
      </UnifiedPipelineStudioNodeContextProvider>
    </UnifiedPipelineStudioProvider>
  )
}
