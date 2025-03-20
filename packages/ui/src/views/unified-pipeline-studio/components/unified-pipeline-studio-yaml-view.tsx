import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Problem, ProblemSeverity } from '@components/problems'
import { editor } from 'monaco-editor'
import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'

import { InlineAction, MonacoGlobals, useYamlEditorContext, YamlEditor } from '@harnessio/yaml-editor'

import { useUnifiedPipelineStudioContext } from '../context/unified-pipeline-studio-context'
import unifiedSchema from '../schema/unified-schema.json'
import { monacoThemes } from '../theme/monaco-theme'
import { YamlRevision } from '../types/common-types'
import { RightDrawer } from '../types/right-drawer-types'
import { getInlineActionConfig, InlineActionArgsType } from '../utils/inline-actions'
import { countProblems, monacoMarkers2Problems } from './graph-implementation/utils/problems-utils'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})

export type YamlErrorDataType = {
  problems: Problem<editor.IMarker>[]
  problemsCount: Record<ProblemSeverity | 'all', number>
  isYamlValid: boolean
}

const PipelineStudioYamlView = (): JSX.Element => {
  const {
    yamlRevision,
    onYamlRevisionChange,
    onErrorsChange,
    setRightDrawer,
    setAddStepIntention,
    setEditStepIntention,
    requestYamlModifications,
    theme
  } = useUnifiedPipelineStudioContext()

  const [reRenderYamlEditor, setRerenderYamlEditor] = useState(0)
  const forceRerender = () => {
    setRerenderYamlEditor(reRenderYamlEditor + 1)
  }

  const { markers } = useYamlEditorContext()

  useEffect(() => {
    if (onErrorsChange) {
      const problems = monacoMarkers2Problems(markers)
      const problemsCount = countProblems(problems)
      const isYamlValid = problemsCount.error === 0

      onErrorsChange({ problems, problemsCount, isYamlValid })
    }
  }, [markers])

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
      defaultTheme: 'dark',
      themes: monacoThemes
    }),
    []
  )

  const addStep = useCallback(
    (path: string, position: InlineActionArgsType['position']) => {
      setRightDrawer(RightDrawer.Collection)
      setAddStepIntention({ path, position })
    },
    [setRightDrawer, setAddStepIntention]
  )

  const deleteStep = useCallback(
    (path: string) => {
      requestYamlModifications.deleteInArray({ path })
    },
    [requestYamlModifications.deleteInArray]
  )

  const editStep = useCallback(
    (path: string) => {
      setRightDrawer(RightDrawer.Form)
      setEditStepIntention({ path })
    },
    [setEditStepIntention]
  )

  const inlineActionCallback: InlineAction<InlineActionArgsType>['onClick'] = useCallback(
    props => {
      console.log(props, 'props1')
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

  return useMemo(() => {
    //   const selection = highlightInYamlPath
    //     ? { path: highlightInYamlPath, className: 'bg-background-4', revealInCenter: true }
    //     : undefined

    return (
      <div className="flex size-full">
        <YamlEditor
          onYamlRevisionChange={value => {
            currentYamlRef.current = value?.yaml
            onYamlRevisionChange(value ?? { yaml: '', revisionId: 0 })
          }}
          yamlRevision={newYamlRef.current}
          themeConfig={themeConfig}
          theme={theme}
          schemaConfig={schemaConfig}
          inlineActions={inlineActions}
          // selection={selection} // TODO
          // animateOnUpdate={animateOnUpdate}
          // onAnimateEnd={onAnimateEnd}
        />
      </div>
    )
  }, [reRenderYamlEditor, themeConfig, schemaConfig, theme]) // inlineActions, highlightInYamlPath
}

export { PipelineStudioYamlView }
