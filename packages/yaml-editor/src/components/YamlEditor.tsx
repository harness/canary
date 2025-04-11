import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Editor, { loader, Monaco, useMonaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import { MonacoCommonDefaultOptions } from '../constants/monaco-common-default-options'
import { useCodeLenses } from '../hooks/useCodeLens'
import { useDecoration } from '../hooks/useDecoration'
import { useProblems } from '../hooks/useProblems'
import { useSchema } from '../hooks/useSchema'
import { useTheme } from '../hooks/useTheme'
import { InlineAction } from '../types/inline-actions'
import { PathSelector } from '../types/selectors'
import { ThemeDefinition } from '../types/themes'
import { schemaIdToUrl } from '../utils/schema-utils'
import { useYamlEditorContext } from './YamlProvider'

loader.config({ monaco })

export interface YamlRevision {
  yaml: string
  revisionId?: number
}

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
  ...MonacoCommonDefaultOptions,
  folding: true
}

export interface YamlEditorProps<T> {
  yamlRevision: YamlRevision
  onYamlRevisionChange: (yamlRevision: YamlRevision | undefined, ev: monaco.editor.IModelContentChangedEvent) => void
  schemaConfig?: { schema: any; uri: string }
  inlineActions?: { selectors: PathSelector[]; actions: InlineAction<T>[] }[]
  themeConfig?: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  selection?: {
    path: string
    className: string
    revealInCenter?: boolean
  }
  animateOnUpdate?: boolean
  onAnimateEnd?: () => void
  instanceId?: string
}

export const YamlEditor = function YamlEditor<T>(props: YamlEditorProps<T>): JSX.Element {
  const {
    yamlRevision,
    schemaConfig,
    inlineActions,
    themeConfig,
    onYamlRevisionChange,
    selection,
    theme: themeFromProps,
    options: userOptions,
    animateOnUpdate = false,
    onAnimateEnd,
    instanceId
  } = props
  const monaco = useMonaco()
  const [instanceIdLocal] = useState(instanceId ?? `yaml-editor-${Math.random()}`)
  const { editor, setEditor } = useYamlEditorContext()

  const rootDivRef = useRef<HTMLDivElement | null>(null)

  const monacoRef = useRef<typeof monaco>()
  const currentRevisionRef = useRef<YamlRevision>({ yaml: '', revisionId: 0 })

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const intervalIdRef = useRef<number | null>(null)

  const replaceYamlWithAnimation = useCallback(
    (yaml: string) => {
      const lines = yaml.split('\n')
      const model = editorRef.current?.getModel()
      if (model) {
        editorRef.current?.pushUndoStop()
        model.setValue('')
        let index = 0
        intervalIdRef.current = window.setInterval(() => {
          if (index < lines.length) {
            if (monaco) {
              editorRef.current?.executeEdits('addLine', [
                {
                  range: new monaco.Range(index + 1, 1, index + 1, 1),
                  text: lines[index] + '\n'
                }
              ])
            }
            index++
          } else {
            if (intervalIdRef.current) {
              clearInterval(intervalIdRef.current)
              onAnimateEnd?.()
            }
          }
        }, 100) // 100ms delay between each line
        editorRef.current?.pushUndoStop()
      }
    },
    [monaco]
  )

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }
    }
  }, [])

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor
    monacoRef.current = monaco

    editor.setValue(yamlRevision.yaml)

    setEditor(editor)

    // NOTE: to prevent initial flickering (left line) we use opacity to show editor with delay
    setTimeout(() => {
      if (rootDivRef.current?.style) {
        rootDivRef.current.style.opacity = '1'
      }
    }, 50)
  }

  useEffect(() => {
    if (editorRef.current) {
      if (!yamlRevision.revisionId || yamlRevision.revisionId > Number(currentRevisionRef.current?.revisionId)) {
        // editorRef.current?.setValue(yamlRevision.yaml)

        const model = editorRef.current.getModel()
        if (model) {
          // editorRef.current.pushUndoStop()
          editorRef.current.executeEdits('edit', [
            {
              range: model.getFullModelRange(),
              text: animateOnUpdate ? '' : yamlRevision.yaml
            }
          ])
          // editorRef.current.pushUndoStop()
          if (animateOnUpdate) {
            replaceYamlWithAnimation(yamlRevision.yaml)
          }
        }
      }
    }
  }, [replaceYamlWithAnimation, yamlRevision, animateOnUpdate])

  useSchema({ schemaConfig, instanceId })

  useCodeLenses({ editorRef, inlineActions })

  const { theme } = useTheme({ monacoRef, themeConfig, editor, theme: themeFromProps })

  useProblems({ monacoRef })

  useDecoration({ editorRef, selection })

  const mergedOptions = useMemo(
    () => ({
      ...options,
      ...userOptions
    }),
    [userOptions]
  )

  return (
    <div style={{ width: '100%', height: '100%', opacity: 0 }} ref={rootDivRef}>
      <Editor
        onChange={(value, data) => {
          currentRevisionRef.current = { yaml: value ?? '', revisionId: data.versionId }
          onYamlRevisionChange({ ...currentRevisionRef.current }, data)
        }}
        language="yaml"
        theme={theme}
        options={mergedOptions}
        path={schemaIdToUrl(instanceIdLocal)}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}
