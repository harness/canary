import { useMemo, useRef, useState } from 'react'

import { DiffEditor, loader, MonacoDiffEditor, useMonaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import { useTheme } from '../hooks/useTheme'
import { ThemeDefinition } from '../types/themes'

loader.config({ monaco })

export interface CodeRevision {
  code: string
  revisionId?: number
}

const defaultOptions: monaco.editor.IStandaloneDiffEditorConstructionOptions = {
  selectOnLineNumbers: true,
  minimap: { enabled: false },
  codeLens: false,
  scrollBeyondLastLine: false,
  smartSelect: {
    selectLeadingAndTrailingWhitespace: true
  },
  originalEditable: false,
  overviewRulerBorder: false,
  padding: {
    top: 10
  }
}

export interface DiffEditorProps<_> {
  original: string
  modified: string
  language: string
  themeConfig?: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  options?: {
    readOnly?: boolean
  }
}

export function CodeDiffEditor<T>(props: DiffEditorProps<T>): JSX.Element {
  const { original, modified, language, themeConfig, options } = props
  const monaco = useMonaco()
  const [editor, setEditor] = useState<MonacoDiffEditor | undefined>()

  const monacoRef = useRef<typeof monaco>()

  const { theme } = useTheme({ monacoRef, themeConfig, editor })

  const mergedOptions = useMemo(() => {
    return { ...defaultOptions, ...(options ? options : {}) }
  }, [options])

  return (
    <>
      <DiffEditor
        className="border-border-background border-x border-b"
        language={language}
        theme={theme}
        original={original}
        modified={modified}
        height="75vh"
        options={mergedOptions}
        onMount={setEditor}
      />
    </>
  )
}
