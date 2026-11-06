import { describe, expect, it } from 'vitest'

import { createFakeEditor } from '../../../config/mocks/monaco-editor-react'
import { renderHookCompat } from '../../../config/test-utils'
import { useHighlight } from '../useHighlight'

type Editor = Parameters<typeof useHighlight>[0]['editor']

describe('useHighlight', () => {
  it('decorates every match of the keyword with the highlight class', () => {
    const editor = createFakeEditor()
    const match = { range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 4 } }
    editor.model.findMatches.mockReturnValue([match, match])

    renderHookCompat(() => useHighlight({ editor: editor as unknown as Editor, keyword: 'foo' }), undefined)

    expect(editor.model.findMatches).toHaveBeenCalledWith('foo', false, false, false, null, false)
    expect(editor.model.deltaDecorations).toHaveBeenCalledTimes(2)
    expect(editor.model.deltaDecorations).toHaveBeenCalledWith(
      [],
      [{ range: match.range, options: { isWholeLine: false, inlineClassName: 'CodeEditor_HighlightedText' } }]
    )
  })

  it('does nothing without an editor or keyword', () => {
    const editor = createFakeEditor()

    renderHookCompat(() => useHighlight({ editor: editor as unknown as Editor }), undefined)
    renderHookCompat(() => useHighlight({ keyword: 'foo' }), undefined)

    expect(editor.model.findMatches).not.toHaveBeenCalled()
  })

  it('skips decoration when there are no matches', () => {
    const editor = createFakeEditor()
    editor.model.findMatches.mockReturnValue([])

    renderHookCompat(() => useHighlight({ editor: editor as unknown as Editor, keyword: 'foo' }), undefined)

    expect(editor.model.deltaDecorations).not.toHaveBeenCalled()
  })
})
