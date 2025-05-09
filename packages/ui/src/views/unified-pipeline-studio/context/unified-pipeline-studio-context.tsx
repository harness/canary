import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { TranslationStore } from '@views/repo'

import { IFormDefinition, InputFactory } from '@harnessio/forms'

import { ITemplateListStore } from '..'
import { inputComponentFactory } from '../components/form-inputs/factory/factory'
import { Yaml2PipelineGraphOptions } from '../components/graph-implementation/utils/yaml-to-pipeline-graph'
import { AnyStepDefinition } from '../components/steps/types'
import { YamlErrorDataType } from '../components/unified-pipeline-studio-yaml-view'
import { VisualYamlValue } from '../components/visual-yaml-toggle'
import { YamlRevision } from '../types/common-types'
import { RightDrawer } from '../types/right-drawer-types'
import { InlineActionArgsType } from '../utils/inline-actions'
import { deleteItemInArray, injectItemInArray, updateItemInArray } from '../utils/yaml-utils'

export type FormEntityType = {
  source: 'embedded' | 'external'
  type: 'step'
  data: {
    identifier: string
    version?: string
    description?: string
  }
}

export type lastCommitInfoType = {
  committedTimeAgo: string
  authorName: string
  authorInitials?: string
  commitSha?: string
  commitMessage?: string
}

// add step intention
export type AddStepIntentionType = {
  path: string
  position: InlineActionArgsType['position']
} | null

//  edit step intention
export type EditStepIntentionType = {
  path: string
} | null

// add stage intention
export type AddStageIntentionType = {
  path: string
  position: InlineActionArgsType['position']
} | null

//  edit stage intention
export type EditStageIntentionType = {
  path: string
} | null

export interface UnifiedPipelineStudioContextProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  onDownloadYaml: (yaml: string) => void
  onSave: (yaml: string) => void
  onRun: () => void
  saveInProgress?: boolean
  isYamlDirty: boolean
  theme?: 'light' | 'dark' | string
  selectedPath?: string
  onSelectedPathChange: (path: string) => void
  errors: YamlErrorDataType
  lastCommitInfo?: lastCommitInfoType
  onErrorsChange?: (errors: YamlErrorDataType) => void
  panelOpen: boolean
  onPanelOpenChange?: (open: boolean) => void
  useTranslationStore: () => TranslationStore
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  rightDrawer: RightDrawer
  setRightDrawer: (rightDrawer: RightDrawer) => void
  addStepIntention: AddStepIntentionType
  setAddStepIntention: (addStepIntention: AddStepIntentionType) => void
  clearAddStepIntention: () => void
  editStepIntention: EditStepIntentionType
  setEditStepIntention: (editStepIntention: EditStepIntentionType) => void
  clearEditStepIntention: () => void
  // TODO: merge steps and stage intention
  addStageIntention: AddStageIntentionType
  setAddStageIntention: (addStepIntention: AddStageIntentionType) => void
  clearAddStageIntention: () => void
  editStageIntention: EditStageIntentionType
  setEditStageIntention: (editStepIntention: EditStageIntentionType) => void
  clearEditStageIntention: () => void
  requestYamlModifications: {
    injectInArray: (props: {
      path: string
      position: 'in' | 'after' | 'after' | 'before' | undefined
      item: unknown
    }) => void
    updateInArray: (props: { path: string; item: unknown }) => void
    deleteInArray: (props: { path: string }) => void
  }
  clearRightDrawerData: () => void
  formEntity: FormEntityType | null
  setFormEntity: (formEntity: FormEntityType) => void
  useTemplateListStore: () => ITemplateListStore
  inputComponentFactory: InputFactory
  stepsDefinitions?: AnyStepDefinition[]
  animateOnUpdate?: boolean
  onAnimateEnd?: () => void
  hideSaveBtn?: boolean
  yamlParserOptions?: Yaml2PipelineGraphOptions
  stageFormDefinition?: IFormDefinition
}

export const UnifiedPipelineStudioContext = createContext<UnifiedPipelineStudioContextProps>({
  yamlRevision: { yaml: '' },
  onYamlRevisionChange: (_yamlRevision: YamlRevision) => undefined,
  onDownloadYaml: (_yaml: string) => undefined,
  onSave: (_yaml: string) => undefined,
  onRun: () => undefined,
  isYamlDirty: false,
  saveInProgress: false,
  selectedPath: undefined,
  onSelectedPathChange: (_path: string) => undefined,
  errors: { isYamlValid: true, problems: [], problemsCount: { all: 0, error: 0, info: 0, warning: 0 } },
  onErrorsChange: (_errors: YamlErrorDataType) => undefined,
  panelOpen: false,
  onPanelOpenChange: (_open: boolean) => undefined,
  useTranslationStore: () => ({}) as TranslationStore,
  view: 'visual',
  setView: (_view: VisualYamlValue) => undefined,
  rightDrawer: RightDrawer.None,
  setRightDrawer: (_rightDrawer: RightDrawer) => undefined,
  addStepIntention: null,
  setAddStepIntention: (_addStepIntention: AddStepIntentionType) => undefined,
  clearAddStepIntention: () => undefined,
  editStepIntention: null,
  setEditStepIntention: (_editStepIntention: EditStepIntentionType) => undefined,
  clearEditStepIntention: () => undefined,
  addStageIntention: null,
  setAddStageIntention: (_addStepIntention: AddStepIntentionType) => undefined,
  clearAddStageIntention: () => undefined,
  editStageIntention: null,
  setEditStageIntention: (_editStepIntention: EditStepIntentionType) => undefined,
  clearEditStageIntention: () => undefined,
  requestYamlModifications: {
    injectInArray: (_props: {
      path: string
      position: 'in' | 'after' | 'after' | 'before' | undefined
      item: unknown
    }) => undefined,
    updateInArray: (_props: { path: string; item: unknown }) => undefined,
    deleteInArray: (_props: { path: string }) => undefined
  },
  clearRightDrawerData: () => undefined,
  formEntity: null,
  setFormEntity: (_formEntity: FormEntityType) => undefined,
  useTemplateListStore: () => ({}) as ITemplateListStore,
  inputComponentFactory: new InputFactory(),
  stepsDefinitions: [],
  lastCommitInfo: {
    committedTimeAgo: '',
    authorName: ''
  }
})

export function useUnifiedPipelineStudioContext(): UnifiedPipelineStudioContextProps {
  return useContext(UnifiedPipelineStudioContext)
}

export interface UnifiedPipelineStudioProviderProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  onDownloadYaml: (yaml: string) => void
  onSave: (yaml: string) => void
  onRun: () => void
  saveInProgress?: boolean
  isYamlDirty: boolean
  theme?: 'light' | 'dark' | string
  selectedPath?: string
  onSelectedPathChange: (path: string) => void
  errors: YamlErrorDataType
  onErrorsChange?: (errors: YamlErrorDataType) => void
  panelOpen: boolean
  onPanelOpenChange?: (open: boolean) => void
  useTranslationStore: () => TranslationStore
  view: VisualYamlValue
  setView: (view: VisualYamlValue) => void
  useTemplateListStore: () => ITemplateListStore
  inputComponentFactory?: InputFactory
  stepsDefinitions?: AnyStepDefinition[]
  animateOnUpdate?: boolean
  onAnimateEnd?: () => void
  hideSaveBtn?: boolean
  yamlParserOptions?: Yaml2PipelineGraphOptions
  lastCommitInfo?: lastCommitInfoType
  stageFormDefinition?: IFormDefinition
}

export const UnifiedPipelineStudioProvider: React.FC<UnifiedPipelineStudioProviderProps> = props => {
  const {
    children,
    yamlRevision,
    onYamlRevisionChange,
    inputComponentFactory: inputComponentFactoryFromProps,
    onSelectedPathChange: onSelectedPathChangeFromProps,
    lastCommitInfo,
    ...rest
  } = props

  const [rightDrawer, setRightDrawer] = useState<RightDrawer>(RightDrawer.None)

  const [addStepIntention, setAddStepIntention] = useState<AddStepIntentionType>(null)
  const [editStepIntention, setEditStepIntention] = useState<EditStepIntentionType>(null)

  const clearEditStepIntention = useCallback(() => {
    setEditStepIntention(null)
    onSelectedPathChange(undefined)
  }, [setEditStepIntention])

  const clearAddStepIntention = useCallback(() => {
    setAddStepIntention(null)
  }, [setAddStepIntention])

  const [addStageIntention, setAddStageIntention] = useState<AddStepIntentionType>(null)
  const [editStageIntention, setEditStageIntention] = useState<EditStepIntentionType>(null)

  const clearEditStageIntention = useCallback(() => {
    setEditStageIntention(null)
    onSelectedPathChange(undefined)
  }, [setEditStepIntention])

  const clearAddStageIntention = useCallback(() => {
    setAddStageIntention(null)
  }, [setAddStepIntention])

  // TODO: rename to stepFormEntity
  const [formEntity, setFormEntity] = useState<FormEntityType | null>(null)

  const injectInArray = useCallback(
    (injectData: { path: string; position: 'after' | 'before' | 'in' | undefined; item: unknown }) => {
      const yaml = injectItemInArray(yamlRevision.yaml, injectData)
      onYamlRevisionChange({ yaml })
    },
    [yamlRevision]
  )

  const updateInArray = useCallback(
    (injectData: { path: string; item: unknown }) => {
      const yaml = updateItemInArray(yamlRevision.yaml, injectData)
      onYamlRevisionChange({ yaml })
    },
    [yamlRevision]
  )

  const deleteInArray = useCallback(
    (deleteData: { path: string }) => {
      const yaml = deleteItemInArray(yamlRevision.yaml, deleteData)
      onYamlRevisionChange({ yaml })
    },
    [yamlRevision]
  )

  const clearRightDrawerData = useCallback(() => {
    clearAddStepIntention()
    clearEditStepIntention()
    setFormEntity(null)

    clearAddStageIntention()
    clearEditStageIntention()
  }, [clearAddStepIntention, clearEditStepIntention, setFormEntity])

  const requestYamlModifications = useMemo(
    () => ({
      injectInArray,
      deleteInArray,
      updateInArray
    }),
    [injectInArray, deleteInArray, updateInArray]
  )

  const onSelectedPathChange = useCallback(
    path => {
      onSelectedPathChangeFromProps(path)
    },
    [onSelectedPathChangeFromProps]
  )

  return (
    <UnifiedPipelineStudioContext.Provider
      value={{
        ...rest,
        rightDrawer,
        setRightDrawer,
        addStepIntention,
        setAddStepIntention,
        clearAddStepIntention,
        editStepIntention,
        setEditStepIntention,
        clearEditStepIntention,
        addStageIntention,
        setAddStageIntention,
        clearAddStageIntention,
        editStageIntention,
        setEditStageIntention,
        clearEditStageIntention,
        yamlRevision,
        onYamlRevisionChange,
        requestYamlModifications,
        formEntity,
        setFormEntity,
        clearRightDrawerData,
        inputComponentFactory: inputComponentFactoryFromProps ?? inputComponentFactory,
        onSelectedPathChange,
        lastCommitInfo
      }}
    >
      {children}
    </UnifiedPipelineStudioContext.Provider>
  )
}
