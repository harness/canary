import { TranslationStore } from '..'
import { UnifiedPipelineStudioNodeContextProvider } from './components/graph-implementation/context/UnifiedPipelineStudioNodeContext'
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
}

export const UnifiedPipelineStudio = (props: UnifiedPipelineStudioProps): JSX.Element => {
  const { useUnifiedPipelineStudioStore, initialView = 'visual', useTranslationStore, useTemplateListStore } = props
  const {
    yamlRevision,
    onYamlRevisionChange,
    onSelectedPathChange,
    selectedPath,
    errors,
    onErrorsChange,
    panelOpen,
    onPanelOpenChange
  } = useUnifiedPipelineStudioStore()

  return (
    <UnifiedPipelineStudioProvider
      yamlRevision={yamlRevision}
      onYamlRevisionChange={onYamlRevisionChange}
      onSelectedPathChange={onSelectedPathChange}
      selectedPath={selectedPath}
      errors={errors}
      onErrorsChange={onErrorsChange}
      panelOpen={panelOpen}
      onPanelOpenChange={onPanelOpenChange}
      useTranslationStore={useTranslationStore}
      useTemplateListStore={useTemplateListStore}
      initialView={initialView}
    >
      <UnifiedPipelineStudioNodeContextProvider>
        <PipelineStudioInternal />
        <PipelineStudioNodeContextMenu />
      </UnifiedPipelineStudioNodeContextProvider>
    </UnifiedPipelineStudioProvider>
  )
}
