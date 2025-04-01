import * as monaco from 'monaco-editor'

export const MonacoCommonDefaultOptions: monaco.editor.IStandaloneDiffEditorConstructionOptions = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
  padding: {
    top: 16,
    bottom: 16
  },
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: '"JetBrains Mono", "monospace"',
  lineHeight: 20,
  scrollbar: {
    verticalScrollbarSize: 14,
    horizontalScrollbarSize: 14,
    verticalSliderSize: 6,
    horizontalSliderSize: 6
  },
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  renderLineHighlight: 'none'
}
