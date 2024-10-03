import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { InlineAction, YamlEditor, MonacoGlobals } from '@harnessio/yaml-editor'
import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { InlineActionArgsType, getInlineActionConfig } from '../utils/inline-actions'
import { themes } from '../theme/monaco-theme'
import { YamlRevision, usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import unifiedSchema from '../schema/unifiedSchema.json'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})

const PipelineStudioYamlView = (): JSX.Element => {
  const {
    state: { yamlRevision },
    setYamlRevision,
    setAddStepIntention,
    setEditStepIntention,
    requestYamlModifications: { deleteInArray }
  } = usePipelineDataContext()
  const { setStepDrawerOpen } = usePipelineViewContext()

  const [reRenderYamlEditor, setRerenderYamlEditor] = useState(0)
  const forceRerender = () => {
    setRerenderYamlEditor(reRenderYamlEditor + 1)
  }

  // stores current yaml we have in monaco
  const currentYamlRef = useRef<string | undefined>('')

  // hold yaml from context, this will be used for feeding YamlEditor as we use reRenderYamlEditor for rerendering YamlEditor
  const newYamlRef = useRef<YamlRevision>(yamlRevision)
  newYamlRef.current = yamlRevision

  const schemaConfig = useMemo(
    () => ({
      schema: unifiedSchema,
      uri: 'https://raw.githubusercontent.com/bradrydzewski/spec/master/dist/schema.json'
    }),
    []
  )

  const themeConfig = useMemo(
    () => ({
      //rootElementSelector: '#react-root',
      defaultTheme: 'dark',
      themes
    }),
    []
  )

  const addStep = useCallback(
    (path: string, position: InlineActionArgsType['position']) => {
      setStepDrawerOpen(StepDrawer.Collection)
      setAddStepIntention({ path, position })
    },
    [setStepDrawerOpen, setAddStepIntention]
  )

  const deleteStep = useCallback(
    (path: string) => {
      deleteInArray({ path })
    },
    [deleteInArray]
  )

  const editStep = useCallback(
    (path: string) => {
      setStepDrawerOpen(StepDrawer.Form)
      setEditStepIntention({ path })
    },
    [setEditStepIntention]
  )

  const inlineActionCallback: InlineAction<InlineActionArgsType>['onClick'] = useCallback(
    props => {
      const { data, path } = props
      // TODO: move this to utils, refactor
      switch (data.entityType) {
        case 'step':
          switch (data.action) {
            case 'add':
              addStep(path, data.position)
              break
            case 'edit':
              editStep(path)
              break
            case 'delete':
              deleteStep(path)
              break
          }
          break
        default:
          break
      }
    },
    [addStep, deleteStep, editStep]
  )
  const inlineActions = useMemo(() => getInlineActionConfig(inlineActionCallback), [inlineActionCallback])

  useEffect(() => {
    if (yamlRevision.yaml !== currentYamlRef.current) {
      forceRerender()
    }
  }, [yamlRevision])

  return useMemo(
    () => (
      <div className="flex h-full w-full">
        <YamlEditor
          onYamlRevisionChange={value => {
            currentYamlRef.current = value?.yaml
            setYamlRevision(value ?? { yaml: '', revisionId: 0 })
          }}
          yamlRevision={newYamlRef.current}
          themeConfig={themeConfig}
          schemaConfig={schemaConfig}
          inlineActions={inlineActions}
        />
      </div>
    ),
    [reRenderYamlEditor, themeConfig, schemaConfig, inlineActions]
  )
}

export { PipelineStudioYamlView }
