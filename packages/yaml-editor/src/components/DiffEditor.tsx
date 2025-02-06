import { useMemo, useRef, useState } from 'react'

import { DiffEditor, EditorProps, loader, MonacoDiffEditor, useMonaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import { MonacoCommonDefaultOptions } from '../constants/monaco-common-default-options'
import { useTheme } from '../hooks/useTheme'
import { ThemeDefinition } from '../types/themes'

loader.config({ monaco })

export interface CodeRevision {
  code: string
  revisionId?: number
}

const defaultOptions: monaco.editor.IStandaloneDiffEditorConstructionOptions = {
  ...MonacoCommonDefaultOptions,
  codeLens: false,
  smartSelect: {
    selectLeadingAndTrailingWhitespace: true
  },
  originalEditable: false,
  overviewRulerBorder: false
}

export interface DiffEditorProps<_> {
  original: string
  modified: string
  language: string
  themeConfig?: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  height?: EditorProps['height']
}

export function CodeDiffEditor<T>({
  original,
  modified,
  language,
  themeConfig,
  options,
  theme: themeFromProps,
  height = '75vh'
}: DiffEditorProps<T>): JSX.Element {
  const monaco = useMonaco()
  const [editor, setEditor] = useState<MonacoDiffEditor | undefined>()

  const monacoRef = useRef<typeof monaco>()

  const { theme } = useTheme({ monacoRef, themeConfig, editor, theme: themeFromProps })

  const mergedOptions = useMemo(() => {
    return { ...defaultOptions, ...(options ? options : {}) }
  }, [options])

  return (
    <>
      <DiffEditor
        className="overflow-hidden rounded-b-md border-x border-b"
        language={language}
        theme={theme}
        original={original}
        modified={modified}
        height={height}
        options={mergedOptions}
        onMount={setEditor}
      />
    </>
  )
}
