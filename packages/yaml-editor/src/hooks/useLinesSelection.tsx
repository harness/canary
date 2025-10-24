import { useEffect, useRef } from 'react'

import * as monaco from 'monaco-editor'

export interface UseLinesSelectionProps {
  enable: boolean
  editor?: monaco.editor.IStandaloneCodeEditor
  selectedLine?: number
  onSelectedLineChange?: (line: number | undefined) => void
  onSelectedLineButtonClick?: (ev: HTMLDivElement | undefined) => void
}
export function useLinesSelection(props: UseLinesSelectionProps) {
  const { enable, editor, onSelectedLineChange, selectedLine, onSelectedLineButtonClick } = props

  // user selection
  const currentlySelectedLineRef = useRef<number | null>(null)

  // is user selection is in progress
  const isSelectingRef = useRef(false)

  const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null)
  decorationsRef.current = decorationsRef.current ?? editor?.createDecorationsCollection([]) ?? null

  useEffect(() => {
    let mouseDownListener: monaco.IDisposable

    const timeoutHandle = setTimeout(() => {
      if (!enable || !editor) return

      const handleMouseDown = (e: monaco.editor.IEditorMouseEvent) => {
        if (e.target?.element?.classList.contains('CodeEditor_HighlightedGlyphMargin')) {
          onSelectedLineButtonClick?.(e.target?.element as HTMLDivElement)

          return
        }

        const lineNumber = getLineNumber(e.target?.element)

        if (!lineNumber) {
          onSelectedLineChange?.(undefined)
          onSelectedLineButtonClick?.(undefined)
          updateSelection(editor, decorationsRef.current, undefined)

          return
        }

        isSelectingRef.current = true
        currentlySelectedLineRef.current = lineNumber

        onSelectedLineChange?.(lineNumber)
        updateSelection(editor, decorationsRef.current, lineNumber, false)
        onSelectedLineButtonClick?.(undefined)
      }

      mouseDownListener = editor.onMouseDown(handleMouseDown)
    }, 100)

    return () => {
      clearTimeout(timeoutHandle)
      mouseDownListener?.dispose()
    }
  }, [isSelectingRef, selectedLine, onSelectedLineChange, enable, editor, onSelectedLineButtonClick, decorationsRef])

  useEffect(() => {
    if (!editor) return
    if (currentlySelectedLineRef.current === selectedLine) return

    updateSelection(editor, decorationsRef.current, selectedLine, true)
  }, [editor, selectedLine, decorationsRef])
}

function updateSelection(
  editor: monaco.editor.IStandaloneCodeEditor | null,
  decorations: monaco.editor.IEditorDecorationsCollection | null,
  line: number | undefined,
  revealInCenter?: boolean
) {
  if (!line) {
    decorations?.set([])
    return
  }

  decorations?.set([
    {
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'CodeEditor_HighlightedLine'
        // TODO: gonna be used if in the future
        // glyphMarginClassName: 'CodeEditor_HighlightedGlyphMargin'
      }
    }
  ])

  editor?.setSelection(new monaco.Range(line, 0, line, 0))

  if (revealInCenter) editor?.revealLineInCenter(line)
}

function getLineNumber(el: Element | null): number | undefined {
  const lineNumberEl = el?.classList.contains('line-numbers') ? el : undefined
  if (!lineNumberEl) return

  const lineNumber = parseInt(lineNumberEl.textContent ?? '')
  if (isNaN(lineNumber)) return

  return lineNumber
}
