import { useEffect, useMemo, useRef, useState } from 'react'

import Editor, { loader, Monaco, useMonaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import { useTheme } from '../hooks/useTheme'
import { ThemeDefinition } from '../types/themes'

loader.config({ monaco })

export interface CodeRevision {
  code: string
  revisionId?: number
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
  padding: {
    top: 10
  },
  minimap: { enabled: false }
}

export interface CodeEditorProps<_> {
  codeRevision: CodeRevision
  onCodeRevisionChange: (codeRevision: CodeRevision | undefined, ev: monaco.editor.IModelContentChangedEvent) => void
  language: string
  themeConfig?: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  options?: {
    readOnly?: boolean
  }
}

export function CodeEditor<T>(props: CodeEditorProps<T>): JSX.Element {
  const { codeRevision, onCodeRevisionChange, language, themeConfig, options } = props
  const monaco = useMonaco()
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | undefined>()

  const monacoRef = useRef<typeof monaco>()
  const currentRevisionRef = useRef<CodeRevision>({ code: '', revisionId: 0 })

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor
    monacoRef.current = monaco

    editor.setValue(codeRevision.code)

    setEditor(editor)
  }

  useEffect(() => {
    if (editorRef.current) {
      if (!codeRevision.revisionId || codeRevision.revisionId > Number(currentRevisionRef.current?.revisionId)) {
        const model = editorRef.current.getModel()
        if (model) {
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

  const { theme } = useTheme({ monacoRef, themeConfig, editor })

  const mergedOptions = useMemo(() => {
    return { ...defaultOptions, ...(options ? options : {}) }
  }, [options])

  return (
    <>
      <Editor
        className="rounded-b-md border-x border-b overflow-hidden"
        height={'75vh'}
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
