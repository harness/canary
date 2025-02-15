import { useEffect, useMemo, useRef, useState } from 'react'

import type { Problem, ProblemSeverity } from '@components/problems'
import { editor } from 'monaco-editor'
import { ILanguageFeaturesService } from 'monaco-editor/esm/vs/editor/common/services/languageFeatures.js'
import { OutlineModel } from 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/outlineModel.js'
import { StandaloneServices } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js'

import { MonacoGlobals, useYamlEditorContext, YamlEditor } from '@harnessio/yaml-editor'

import { YamlRevision } from '../pipeline-studio'
import unifiedSchema from '../schema/unifiedSchema.json'
import { themes } from '../theme/monaco-theme'
import { countProblems, monacoMarkers2Problems } from './graph-implementation/utils/problems-utils'

MonacoGlobals.set({
  ILanguageFeaturesService,
  OutlineModel,
  StandaloneServices
})

export type ErrorDataType = {
  problems: Problem<editor.IMarker>[]
  problemsCount: Record<ProblemSeverity | 'all', number>
  isYamlValid: boolean
}

export interface PipelineStudioYamlViewProps {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (YamlRevision: YamlRevision) => void
  yamlEditorConfig?: {
    folding?: boolean
    minimap?: boolean
  }
  onErrorChange?: (data: ErrorDataType) => void
  animateOnUpdate?: boolean
  onAnimateEnd?: () => void
}

const PipelineStudioYamlView = (props: PipelineStudioYamlViewProps): JSX.Element => {
  const {
    yamlRevision,
    onYamlRevisionChange,
    yamlEditorConfig = {},
    onErrorChange,
    animateOnUpdate,
    onAnimateEnd
  } = props

  const [reRenderYamlEditor, setRerenderYamlEditor] = useState(0)
  const forceRerender = () => {
    setRerenderYamlEditor(reRenderYamlEditor + 1)
  }

  const { markers } = useYamlEditorContext()

  useEffect(() => {
    if (onErrorChange) {
      const problems = monacoMarkers2Problems(markers)
      const problemsCount = countProblems(problems)
      const isYamlValid = problemsCount.error === 0

      onErrorChange({ problems, problemsCount, isYamlValid })
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
      themes
    }),
    []
  )

  // const addStep = useCallback(
  //   (path: string, position: InlineActionArgsType['position']) => {
  //     setStepDrawerOpen(StepDrawer.Collection)
  //     setAddStepIntention({ path, position })
  //   },
  //   [setStepDrawerOpen, setAddStepIntention]
  // )

  // const deleteStep = useCallback(
  //   (path: string) => {
  //     deleteInArray({ path })
  //   },
  //   [deleteInArray]
  // )

  // const editStep = useCallback(
  //   (path: string) => {
  //     setStepDrawerOpen(StepDrawer.Form)
  //     setEditStepIntention({ path })
  //   },
  //   [setEditStepIntention]
  // )

  // const inlineActionCallback: InlineAction<InlineActionArgsType>['onClick'] = useCallback(
  //   props => {
  //     const { data, path } = props
  //     // TODO: move this to utils, refactor
  //     switch (data.entityType) {
  //       case 'step':
  //         switch (data.action) {
  //           case 'add':
  //             addStep(path, data.position)
  //             break
  //           case 'edit':
  //             editStep(path)
  //             break
  //           case 'delete':
  //             deleteStep(path)
  //             break
  //         }
  //         break
  //       default:
  //         break
  //     }
  //   },
  //   [addStep, deleteStep, editStep]
  // )
  // const inlineActions = useMemo(() => getInlineActionConfig(inlineActionCallback), [inlineActionCallback])

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
          //theme={theme} // TODO
          schemaConfig={schemaConfig}
          // inlineActions={inlineActions} // TODO
          // selection={selection} // TODO
          animateOnUpdate={animateOnUpdate}
          onAnimateEnd={onAnimateEnd}
          {...yamlEditorConfig}
        />
      </div>
    )
  }, [reRenderYamlEditor, themeConfig, schemaConfig]) // inlineActions, highlightInYamlPath
}

export { PipelineStudioYamlView }
