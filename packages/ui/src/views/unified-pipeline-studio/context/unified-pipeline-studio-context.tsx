import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { TranslationStore } from '@views/repo'

import { InputFactory } from '@harnessio/forms'

import { ITemplateListStore } from '..'
import { inputComponentFactory } from '../components/form-inputs/factory/factory'
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
    description?: string
  }
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

export interface UnifiedPipelineStudioContextProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  onDownloadYaml: (yaml: string) => void
  onSave: (yaml: string) => void
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
  rightDrawer: RightDrawer
  setRightDrawer: (rightDrawer: RightDrawer) => void
  addStepIntention: AddStepIntentionType
  setAddStepIntention: (addStepIntention: AddStepIntentionType) => void
  clearAddStepIntention: () => void
  editStepIntention: EditStepIntentionType
  setEditStepIntention: (editStepIntention: EditStepIntentionType) => void
  clearEditStepIntention: () => void
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
}

export const UnifiedPipelineStudioContext = createContext<UnifiedPipelineStudioContextProps>({
  yamlRevision: { yaml: '' },
  onYamlRevisionChange: (_yamlRevision: YamlRevision) => undefined,
  onDownloadYaml: (_yaml: string) => undefined,
  onSave: (_yaml: string) => undefined,
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
  stepsDefinitions: []
})

export function useUnifiedPipelineStudioContext(): UnifiedPipelineStudioContextProps {
  return useContext(UnifiedPipelineStudioContext)
}

export interface UnifiedPipelineStudioProviderProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  onDownloadYaml: (yaml: string) => void
  onSave: (yaml: string) => void
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
  initialView?: VisualYamlValue
  useTemplateListStore: () => ITemplateListStore
  inputComponentFactory?: InputFactory
  stepsDefinitions?: AnyStepDefinition[]
}

export const UnifiedPipelineStudioProvider: React.FC<UnifiedPipelineStudioProviderProps> = props => {
  const {
    children,
    initialView = 'visual',
    yamlRevision,
    onYamlRevisionChange,
    inputComponentFactory: inputComponentFactoryFromProps,
    ...rest
  } = props

  const [view, setView] = useState(initialView)
  const [rightDrawer, setRightDrawer] = useState<RightDrawer>(RightDrawer.None)

  const [addStepIntention, setAddStepIntention] = useState<AddStepIntentionType>(null)
  const [editStepIntention, setEditStepIntention] = useState<EditStepIntentionType>(null)

  const [formEntity, setFormEntity] = useState<FormEntityType | null>(null)

  const clearEditStepIntention = useCallback(() => {
    setEditStepIntention(null)
  }, [setEditStepIntention])

  const clearAddStepIntention = useCallback(() => {
    setAddStepIntention(null)
  }, [setAddStepIntention])

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
  }, [clearAddStepIntention, clearEditStepIntention, setFormEntity])

  const requestYamlModifications = useMemo(
    () => ({
      injectInArray,
      deleteInArray,
      updateInArray
    }),
    [injectInArray, deleteInArray, updateInArray]
  )

  return (
    <UnifiedPipelineStudioContext.Provider
      value={{
        ...rest,
        view,
        setView,
        rightDrawer,
        setRightDrawer,
        addStepIntention,
        setAddStepIntention,
        clearAddStepIntention,
        editStepIntention,
        setEditStepIntention,
        clearEditStepIntention,
        yamlRevision,
        onYamlRevisionChange,
        requestYamlModifications,
        formEntity,
        setFormEntity,
        clearRightDrawerData,
        inputComponentFactory: inputComponentFactoryFromProps ?? inputComponentFactory
      }}
    >
      {children}
    </UnifiedPipelineStudioContext.Provider>
  )
}
