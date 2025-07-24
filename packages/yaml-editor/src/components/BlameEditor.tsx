import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import Editor, { EditorProps, loader, Monaco, useMonaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import { MonacoCommonDefaultOptions } from '../constants/monaco-common-default-options'
import { useTheme } from '../hooks/useTheme'
import { BlameItem } from '../types/blame'
import { ThemeDefinition } from '../types/themes'
import { createCommitMessage, getMonacoEditorCommitCss, getMonacoEditorCss } from '../utils/blame-editor-utils'
import { createRandomString } from '../utils/utils'

loader.config({ monaco })

const BLAME_MESSAGE_WIDTH = 450
const COMMIT_MESSAGE_LENGTH = 30
const DATE_WIDTH = 140
const AVATAR_SIZE = 24

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  ...MonacoCommonDefaultOptions,
  readOnly: true,
  matchBrackets: 'never',
  renderValidationDecorations: 'off',
  guides: { indentation: false },
  folding: false,
  stickyScroll: { enabled: false },
  renderWhitespace: 'none',
  renderLineHighlight: 'none'
}

export interface BlameEditorProps {
  code: string
  language: string
  themeConfig?: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  theme?: string
  lineNumbersPosition?: 'left' | 'center'
  blameData: BlameItem[]
  showSeparators?: boolean
  height?: EditorProps['height']
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  className?: string
}

export function BlameEditor({
  code,
  language,
  themeConfig,
  lineNumbersPosition = 'left',
  blameData,
  showSeparators = true,
  theme: themeFromProps,
  height = '75vh',
  options,
  className
}: BlameEditorProps): JSX.Element {
  const blameDataRef = useRef(blameData)

  const holderRef = useRef<HTMLDivElement>(null)

  const instanceId = useRef(createRandomString(5))
  const monaco = useMonaco()
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | undefined>()

  const monacoRef = useRef<typeof monaco | null>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    blameDataRef.current = blameData
  }, [blameData])

  function setupBlameEditor() {
    const editor = editorRef.current
    const monaco = monacoRef.current

    if (!editor || !monaco) return

    // separators
    if (showSeparators) {
      editor.changeViewZones(function (changeAccessor) {
        // space before first line
        changeAccessor.addZone({
          afterLineNumber: 0,
          heightInPx: 10,
          domNode: document.createElement('div')
        })

        blameDataRef.current.forEach((blameItem, index) => {
          if (index !== blameDataRef.current.length - 1) {
            const domNode = document.createElement('div')
            domNode.style.borderTop = '1px solid var(--cn-border-2)'
            domNode.style.marginTop = '9px'
            domNode.className = 'blame-editor-separator'

            changeAccessor.addZone({
              afterLineNumber: blameItem.toLineNumber,
              heightInPx: 20,
              domNode: domNode
            })
          }
        })
      })
    }

    const decoratorItems: monaco.editor.IModelDeltaDecoration[] = []
    blameDataRef.current.forEach(blameItem => {
      for (let lineNo = blameItem.fromLineNumber; lineNo <= blameItem.toLineNumber; lineNo++) {
        decoratorItems.push({
          range: new monaco.Range(lineNo, 0, lineNo + 1, 0),
          options: {
            before: {
              content: createCommitMessage(
                lineNo === blameItem.fromLineNumber ? blameItem?.commitInfo?.title || '' : '',
                COMMIT_MESSAGE_LENGTH
              ),
              cursorStops: monaco.editor.InjectedTextCursorStops.None,
              inlineClassName: `blame-editor-commit blame-editor-commit-${lineNo}`
            }
          }
        })
      }
    })

    // TODO: on unmount clear decorators, on blameData change recreate
    editor.createDecorationsCollection(decoratorItems)
  }

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor
    monacoRef.current = monaco

    editor.setValue(code)
    setEditor(editor)

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

    setupBlameEditor()
  }

  useEffect(() => {
    editor?.setValue(code)
  }, [code])

  const { theme } = useTheme({ monacoRef, themeConfig, editor, theme: themeFromProps })

  const monacoEditorCss = useMemo(
    () =>
      getMonacoEditorCss({
        instanceId: instanceId.current,
        lineNumbersPosition
      }),
    [blameData]
  )

  const monacoEditorCommitInfoCss = useMemo(
    () =>
      getMonacoEditorCommitCss({
        instanceId: instanceId.current,
        blameData,
        avatarSize: AVATAR_SIZE,
        dateWidth: DATE_WIDTH
      }),
    [blameData]
  )

  // prevent line numbers to appear at the initial position (for a moment)
  useLayoutEffect(() => {
    if (holderRef.current) holderRef.current.style.setProperty('--line-number-display', `none`)
  }, [])

  // set adjustment for lines numbers position
  useEffect(() => {
    if (lineNumbersPosition === 'center' && holderRef.current) {
      const scrollableEl = holderRef.current.getElementsByClassName('lines-content')[0]

      if (scrollableEl) {
        const config = { attributes: true }

        const callback = () => {
          const left = parseInt(getComputedStyle(scrollableEl).left)
          if (holderRef.current) {
            holderRef.current.style.setProperty('--line-number-offset', `${BLAME_MESSAGE_WIDTH + 16 + left}px`)
            holderRef.current.style.setProperty('--line-number-display', `block`)
          }
        }

        const observer = new MutationObserver(callback)
        observer.observe(scrollableEl, config)

        callback()

        return () => {
          observer.disconnect()
        }
      }
    }
  })

  // adjust lines numbers position
  const lineNumbersCss = useMemo(() => {
    return `
      .monaco-editor-${instanceId.current} .margin {
        display: var(--line-number-display);
        left: var(--line-number-offset);
        pointer-events: none;
      }`
  }, [])

  const clipSelection = useMemo(() => {
    return `.monaco-editor-${instanceId.current} .view-overlays {
    clip-path: polygon(${BLAME_MESSAGE_WIDTH + 16}px 0, 100% 0%, 100% 100%, ${BLAME_MESSAGE_WIDTH + 16}px 100%);
    height:100% !important;
   }`
  }, [])

  const mergedOptions = useMemo(
    () => ({
      ...defaultOptions,
      ...options
    }),
    [options]
  )

  const styleEl = useMemo(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `${monacoEditorCss} ${monacoEditorCommitInfoCss} ${lineNumbersCss} ${clipSelection}`
        }}
      />
    )
  }, [monacoEditorCss, monacoEditorCommitInfoCss, clipSelection, lineNumbersCss])

  return (
    <div className={className} ref={holderRef}>
      {styleEl}
      <Editor
        className={`monaco-editor-${instanceId.current} overflow-hidden rounded-b-md border-x border-b`}
        height={height}
        language={language}
        theme={theme}
        options={mergedOptions}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}
