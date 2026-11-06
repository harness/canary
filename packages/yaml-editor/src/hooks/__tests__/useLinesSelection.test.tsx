import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakeEditor, FakeEditor } from '../../../config/mocks/monaco-editor-react'
import { renderHookCompat } from '../../../config/test-utils'
import { useLinesSelection, UseLinesSelectionProps } from '../useLinesSelection'

const asEditor = (e: FakeEditor) => e as unknown as UseLinesSelectionProps['editor']

const lineNumberEl = (text: string) => {
  const el = document.createElement('div')
  el.classList.add('line-numbers')
  el.textContent = text
  return el
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useLinesSelection', () => {
  it('reports the clicked line and selects it on mouse-down over a line number', () => {
    const editor = createFakeEditor()
    const onSelectedLineChange = vi.fn()
    const onSelectedLineButtonClick = vi.fn()

    renderHookCompat(
      () =>
        useLinesSelection({ enable: true, editor: asEditor(editor), onSelectedLineChange, onSelectedLineButtonClick }),
      undefined
    )
    vi.advanceTimersByTime(100)

    const handler = editor.onMouseDown.mock.calls[0][0] as (e: unknown) => void
    handler({ target: { element: lineNumberEl('5') } })

    expect(onSelectedLineChange).toHaveBeenCalledWith(5)
    expect(editor.setSelection).toHaveBeenCalled()
    expect(onSelectedLineButtonClick).toHaveBeenLastCalledWith(undefined)
  })

  it('clears the selection when the mouse-down is not on a line number', () => {
    const editor = createFakeEditor()
    const onSelectedLineChange = vi.fn()

    renderHookCompat(
      () => useLinesSelection({ enable: true, editor: asEditor(editor), onSelectedLineChange }),
      undefined
    )
    vi.advanceTimersByTime(100)

    const handler = editor.onMouseDown.mock.calls[0][0] as (e: unknown) => void
    handler({ target: { element: document.createElement('span') } })

    expect(onSelectedLineChange).toHaveBeenCalledWith(undefined)
  })

  it('routes clicks on the glyph-margin button to onSelectedLineButtonClick', () => {
    const editor = createFakeEditor()
    const onSelectedLineButtonClick = vi.fn()
    const onSelectedLineChange = vi.fn()

    renderHookCompat(
      () =>
        useLinesSelection({ enable: true, editor: asEditor(editor), onSelectedLineButtonClick, onSelectedLineChange }),
      undefined
    )
    vi.advanceTimersByTime(100)

    const glyph = document.createElement('div')
    glyph.classList.add('CodeEditor_HighlightedGlyphMargin')
    const handler = editor.onMouseDown.mock.calls[0][0] as (e: unknown) => void
    handler({ target: { element: glyph } })

    expect(onSelectedLineButtonClick).toHaveBeenCalledWith(glyph)
    expect(onSelectedLineChange).not.toHaveBeenCalled()
  })

  it('applies a programmatic selectedLine (revealing it in the centre)', () => {
    const editor = createFakeEditor()

    renderHookCompat(() => useLinesSelection({ enable: true, editor: asEditor(editor), selectedLine: 3 }), undefined)

    expect(editor.setSelection).toHaveBeenCalled()
    expect(editor.revealLineInCenter).toHaveBeenCalledWith(3)
  })

  it('does not subscribe when disabled', () => {
    const editor = createFakeEditor()
    renderHookCompat(() => useLinesSelection({ enable: false, editor: asEditor(editor) }), undefined)
    vi.advanceTimersByTime(100)

    expect(editor.onMouseDown).not.toHaveBeenCalled()
  })
})
