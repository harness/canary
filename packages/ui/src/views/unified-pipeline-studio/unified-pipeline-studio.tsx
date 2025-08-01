import { IFormDefinition, InputFactory } from '@harnessio/forms'

import { Yaml2PipelineGraphOptions } from './components/graph-implementation/utils/yaml-to-pipeline-graph'
import { AnyStepDefinition } from './components/steps/types'
import { YamlErrorDataType } from './components/unified-pipeline-studio-yaml-view'
import { VisualYamlValue } from './components/visual-yaml-toggle'
import { lastCommitInfoType, UnifiedPipelineStudioProvider } from './context/unified-pipeline-studio-context'
import { YamlRevision } from './types/common-types'
import { PipelineStudioInternal } from './unified-pipeline-studio-internal'

export interface ITemplateListItem {
  identifier: string
  version: string
  description?: string
}

export interface ITemplateListStore {
  templates: ITemplateListItem[] | null
  templatesError?: Error
  setTemplatesData: (data: ITemplateListItem[] | null, totalPages: number) => void
  page: number
  setPage: (page: number) => void
  totalItems: number
  pageSize: number
  searchQuery: string
  setSearchQuery: (query: string) => void
  getTemplateFormDefinition: (identifierWithVersion: string) => Promise<IFormDefinition>
  isLoading: boolean
}

export interface UnifiedPipelineStudioProps {
  useTemplateListStore: () => ITemplateListStore
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision) => void
  onYamlDownload: (yaml: string) => void
  onSave: (yaml: string) => void
  onRun: () => void
  isYamlDirty: boolean
  theme?: 'light' | 'dark' | string
  saveInProgress?: boolean
  loadInProgress?: boolean
  inputComponentFactory?: InputFactory
  stepsDefinitions?: AnyStepDefinition[]
  selectedPath?: {
    stages?: string | undefined
    steps?: string | undefined
    onecanvas?: string | undefined
  }
  onSelectedPathChange: (props: {
    stages?: string | undefined
    steps?: string | undefined
    onecanvas?: string | undefined
  }) => void
  errors: YamlErrorDataType
  onErrorsChange?: (errors: YamlErrorDataType) => void
  panelOpen: boolean
  onPanelOpenChange?: (open: boolean) => void
  animateOnUpdate?: boolean
  onAnimateEnd?: () => void
  hideSaveBtn?: boolean
  yamlParserOptions?: Yaml2PipelineGraphOptions
  lastCommitInfo?: lastCommitInfoType
  stageFormDefinition?: IFormDefinition
  pipelineFormDefinition?: IFormDefinition
}

export const UnifiedPipelineStudio = (props: UnifiedPipelineStudioProps): JSX.Element => {
  const {
    view,
    setView,
    useTemplateListStore,
    yamlRevision,
    onYamlRevisionChange,
    onYamlDownload,
    isYamlDirty,
    onSave,
    onRun,
    theme,
    saveInProgress,
    loadInProgress,
    inputComponentFactory,
    stepsDefinitions,
    selectedPath,
    onSelectedPathChange,
    errors,
    onErrorsChange,
    panelOpen,
    onPanelOpenChange,
    animateOnUpdate,
    onAnimateEnd,
    hideSaveBtn,
    yamlParserOptions,
    lastCommitInfo,
    stageFormDefinition,
    pipelineFormDefinition
  } = props

  return (
    <UnifiedPipelineStudioProvider
      yamlRevision={yamlRevision}
      onYamlRevisionChange={yamlRevision => {
        onYamlRevisionChange(yamlRevision)
      }}
      onDownloadYaml={onYamlDownload}
      isYamlDirty={isYamlDirty}
      onSave={onSave}
      onRun={onRun}
      onSelectedPathChange={onSelectedPathChange}
      selectedPath={selectedPath}
      errors={errors}
      onErrorsChange={onErrorsChange}
      panelOpen={panelOpen}
      onPanelOpenChange={onPanelOpenChange}
      useTemplateListStore={useTemplateListStore}
      view={view}
      setView={setView}
      theme={theme}
      saveInProgress={saveInProgress}
      inputComponentFactory={inputComponentFactory}
      stepsDefinitions={stepsDefinitions}
      animateOnUpdate={animateOnUpdate}
      onAnimateEnd={onAnimateEnd}
      hideSaveBtn={hideSaveBtn}
      yamlParserOptions={yamlParserOptions}
      lastCommitInfo={lastCommitInfo}
      stageFormDefinition={stageFormDefinition}
      pipelineFormDefinition={pipelineFormDefinition}
    >
      {/* <UnifiedPipelineStudioNodeContextProvider> */}
      {/* TODO: Loading... */}
      {loadInProgress ? 'Loading...' : <PipelineStudioInternal />}
      {/* <PipelineStudioNodeContextMenu />
      </UnifiedPipelineStudioNodeContextProvider> */}
    </UnifiedPipelineStudioProvider>
  )
}
