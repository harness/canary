import { useEffect } from 'react'

import * as monaco from 'monaco-editor'

export interface UseHighlightProps {
  editor?: monaco.editor.IStandaloneCodeEditor
  keyword?: string
}

export function useHighlight(props: UseHighlightProps) {
  const { editor, keyword } = props

  useEffect(() => {
    if (!editor || !keyword) return

    const editorModel = editor.getModel() as monaco.editor.ITextModel
    const keywordMatches: monaco.editor.FindMatch[] = editorModel.findMatches(keyword, false, false, false, null, false)

    if (keywordMatches.length > 0) {
      keywordMatches.forEach((match: monaco.editor.FindMatch): void => {
        editorModel.deltaDecorations(
          [],
          [
            {
              range: match.range,
              options: {
                isWholeLine: false,
                inlineClassName: 'CodeEditor_HighlightedText'
              }
            }
          ]
        )
      })
    }
  }, [editor, keyword])
}
