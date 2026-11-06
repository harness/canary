import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakeEditor } from '../../../config/mocks/monaco-editor-react'
import { renderHookCompat } from '../../../config/test-utils'
import { useDecoration } from '../useDecoration'

const processOutlineModel = vi.fn()
vi.mock('../../utils/outline-model-to-path', () => ({
  getOutlineModel: vi.fn().mockResolvedValue({ children: new Map() }),
  processOutlineModel: (...args: unknown[]) => processOutlineModel(...args)
}))

type EditorRef = NonNullable<Parameters<typeof useDecoration>[0]['editorRef']>

beforeEach(() => {
  vi.useFakeTimers()
  // Force the setTimeout fallback branch (deterministic) rather than requestIdleCallback.
  delete (window as unknown as { requestIdleCallback?: unknown }).requestIdleCallback
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useDecoration', () => {
  it('resolves the selected path to a range and decorates that line', async () => {
    const range = { startLineNumber: 7, startColumn: 20, endLineNumber: 7, endColumn: 30 }
    processOutlineModel.mockReturnValue(new Map([['pipeline.name', { range }]]))

    const editor = createFakeEditor()
    renderHookCompat(
      () =>
        useDecoration({
          editorRef: { current: editor } as unknown as EditorRef,
          selection: { path: 'pipeline.name', className: 'cls', revealInCenter: true }
        }),
      undefined
    )

    await vi.advanceTimersByTimeAsync(150)

    expect(editor.revealLineInCenter).toHaveBeenCalledWith(7)
    expect(editor.createDecorationsCollection).toHaveBeenCalledWith([
      { range: { ...range, startColumn: 1 }, options: { isWholeLine: false, className: 'cls' } }
    ])
  })

  it('does not decorate when the path has no matching symbol', async () => {
    processOutlineModel.mockReturnValue(new Map())

    const editor = createFakeEditor()
    renderHookCompat(
      () =>
        useDecoration({
          editorRef: { current: editor } as unknown as EditorRef,
          selection: { path: 'missing', className: 'cls' }
        }),
      undefined
    )

    await vi.advanceTimersByTimeAsync(150)

    expect(editor.createDecorationsCollection).not.toHaveBeenCalled()
  })
})
