import * as monaco from 'monaco-editor'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createFakeEditor } from '../../../config/mocks/monaco-editor-react'
import { renderHookCompat } from '../../../config/test-utils'
import { useProblems } from '../useProblems'

const setMarkers = vi.fn()
vi.mock('../../components/YamlProvider', () => ({
  useYamlEditorContext: () => ({ setMarkers })
}))

type Args = Parameters<typeof useProblems>[0]

beforeEach(() => {
  vi.useFakeTimers()
  setMarkers.mockClear()
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useProblems', () => {
  it('subscribes to marker changes and forwards markers for this editor model', () => {
    let changeHandler: ((uris: Array<{ toString: () => string }>) => void) | undefined
    vi.spyOn(monaco.editor, 'onDidChangeMarkers').mockImplementation(cb => {
      changeHandler = cb as unknown as typeof changeHandler
      return { dispose: vi.fn() }
    })
    const markers = [{ message: 'oops' }]
    vi.spyOn(monaco.editor, 'getModelMarkers').mockReturnValue(markers as unknown as monaco.editor.IMarker[])

    const editor = createFakeEditor()
    renderHookCompat(
      () =>
        useProblems({
          monacoRef: { current: monaco } as unknown as Args['monacoRef'],
          editorRef: { current: editor } as unknown as Args['editorRef'],
          instanceId: 'id-1'
        }),
      undefined
    )

    // Subscription is set up after a 100ms debounce.
    vi.advanceTimersByTime(100)
    expect(changeHandler).toBeTypeOf('function')

    // A marker change touching this model's uri forwards the markers.
    changeHandler?.([{ toString: () => 'file://model' }])
    expect(setMarkers).toHaveBeenCalledWith(markers)
  })

  it('ignores marker changes for other models', () => {
    let changeHandler: ((uris: Array<{ toString: () => string }>) => void) | undefined
    vi.spyOn(monaco.editor, 'onDidChangeMarkers').mockImplementation(cb => {
      changeHandler = cb as unknown as typeof changeHandler
      return { dispose: vi.fn() }
    })

    const editor = createFakeEditor()
    renderHookCompat(
      () =>
        useProblems({
          monacoRef: { current: monaco } as unknown as Args['monacoRef'],
          editorRef: { current: editor } as unknown as Args['editorRef']
        }),
      undefined
    )
    vi.advanceTimersByTime(100)

    changeHandler?.([{ toString: () => 'file://some-other-model' }])
    expect(setMarkers).not.toHaveBeenCalled()
  })
})
