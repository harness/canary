import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Editor, { EditorProps, loader, Monaco, useMonaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import { MonacoCommonDefaultOptions } from '../constants/monaco-common-default-options'
import { useTheme } from '../hooks/useTheme'
import { ThemeDefinition } from '../types/themes'

loader.config({ monaco })

export interface CodeRevision {
  code: string
  revisionId?: number
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  ...MonacoCommonDefaultOptions
}

export interface CodeEditorProps<_> {
  codeRevision: CodeRevision
  onCodeRevisionChange: (codeRevision: CodeRevision | undefined, ev: monaco.editor.IModelContentChangedEvent) => void
  language: string
  themeConfig?: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  height?: EditorProps['height']
  className?: string
}

export function CodeEditor<T>({
  codeRevision,
  onCodeRevisionChange,
  language,
  themeConfig,
  options,
  theme: themeFromProps,
  height = '75vh',
  className
}: CodeEditorProps<T>): JSX.Element {
  const monaco = useMonaco()
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | undefined>()
  const monacoRef = useRef<typeof monaco>()
  const currentRevisionRef = useRef<CodeRevision>({ code: '', revisionId: 0 })
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = useCallback(
    (editorVal: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editorVal
      monacoRef.current = monaco

      editorVal.setValue(codeRevision.code)

      setEditor(editorVal)

      monaco.languages.typescript?.typescriptDefaults?.setDiagnosticsOptions?.({
        noSuggestionDiagnostics: true,
        noSyntaxValidation: true,
        noSemanticValidation: true
      })
      monaco.languages.typescript?.javascriptDefaults?.setDiagnosticsOptions?.({
        noSuggestionDiagnostics: true,
        noSyntaxValidation: true,
        noSemanticValidation: true
      })
    },
    [codeRevision.code]
  )

  useEffect(() => {
    if (!editorRef.current) return

    if (!codeRevision.revisionId || codeRevision.revisionId > Number(currentRevisionRef.current?.revisionId)) {
      const model = editorRef.current.getModel()

      if (model) {
        // NOTE: if it's a readonly no need to create undo stop points
        if (options?.readOnly) {
          editorRef.current?.setValue(codeRevision.code)
        } else {
          editorRef.current.pushUndoStop()
          editorRef.current.executeEdits('edit', [
            {
              range: model.getFullModelRange(),
              text: codeRevision.code
            }
          ])
          editorRef.current.pushUndoStop()
        }
      }
    }
  }, [codeRevision, editorRef.current])

  const { theme } = useTheme({ monacoRef, themeConfig, editor, theme: themeFromProps })

  const mergedOptions = useMemo(() => {
    return { ...defaultOptions, ...(options ? options : {}) }
  }, [options])

  return (
    <>
      <Editor
        className={className}
        height={height}
        onChange={(value, data) => {
          currentRevisionRef.current = { code: value ?? '', revisionId: data.versionId }
          onCodeRevisionChange({ ...currentRevisionRef.current }, data)
        }}
        language={language}
        theme={theme}
        options={mergedOptions}
        onMount={handleEditorDidMount}
      />
    </>
  )
}
