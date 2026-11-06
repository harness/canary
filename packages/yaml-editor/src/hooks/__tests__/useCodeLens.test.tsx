import type { languages } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createFakeEditor } from '../../../config/mocks/monaco-editor-react'
import { renderHookCompat } from '../../../config/test-utils'
import { SelectorType } from '../../types/selectors'
import { useCodeLenses } from '../useCodeLens'

const processOutlineModel = vi.fn()
vi.mock('../../utils/outline-model-to-path', () => ({
  getOutlineModel: vi.fn().mockResolvedValue({ children: new Map() }),
  processOutlineModel: (...args: unknown[]) => processOutlineModel(...args)
}))

const symbol = (range: languages.DocumentSymbol['range']) =>
  ({ name: 'steps', kind: 17, range }) as unknown as languages.DocumentSymbol

type EditorRef = Parameters<typeof useCodeLenses>[0]['editorRef']

const inlineActions = [
  {
    selectors: [{ type: SelectorType.ContainsPath, basePath: 'pipeline.stages.', paths: [/^\d+\.steps$/] }],
    actions: [{ title: 'Add step', onClick: vi.fn() }]
  }
]

afterEach(() => vi.restoreAllMocks())

const captureProvider = () => {
  let provider: monaco.languages.CodeLensProvider | undefined
  vi.spyOn(monaco.languages, 'registerCodeLensProvider').mockImplementation((_lang, p) => {
    provider = p as monaco.languages.CodeLensProvider
    return { dispose: vi.fn() }
  })
  return () => provider
}

describe('useCodeLenses', () => {
  it('registers a yaml code-lens provider that emits lenses for the editor model', async () => {
    const getProvider = captureProvider()
    const range = { startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 6 }
    processOutlineModel.mockReturnValue(new Map([['pipeline.stages.0.steps', symbol(range)]]))

    const editor = createFakeEditor()
    renderHookCompat(
      () => useCodeLenses({ editorRef: { current: editor } as unknown as EditorRef, inlineActions }),
      undefined
    )

    const model = { uri: { toString: () => 'file://model' } } as unknown as monaco.editor.ITextModel
    const result = await getProvider()?.provideCodeLenses?.(model, {} as monaco.CancellationToken)

    const lenses = (result as monaco.languages.CodeLensList).lenses
    expect(lenses).toHaveLength(1)
    expect(lenses[0].command?.title).toBe('Add step')
    expect(editor.addCommand).toHaveBeenCalled()
  })

  it('dispatches the lens arguments to onClick when the registered command fires', async () => {
    const getProvider = captureProvider()
    const range = { startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 6 }
    processOutlineModel.mockReturnValue(new Map([['pipeline.stages.0.steps', symbol(range)]]))

    const editor = createFakeEditor()
    renderHookCompat(
      () => useCodeLenses({ editorRef: { current: editor } as unknown as EditorRef, inlineActions }),
      undefined
    )

    const model = { uri: { toString: () => 'file://model' } } as unknown as monaco.editor.ITextModel
    await getProvider()?.provideCodeLenses?.(model, {} as monaco.CancellationToken)

    // The hook registers a single command whose handler forwards its arguments to the action's onClick.
    const commandHandler = editor.addCommand.mock.calls[0][1] as (
      accessor: unknown,
      args: { onClick: (p: unknown) => void; path: string; range: unknown; data: unknown }
    ) => void
    const onClick = vi.fn()
    commandHandler({}, { onClick, path: 'pipeline.stages.0.steps', range, data: { foo: 'bar' } })

    expect(onClick).toHaveBeenCalledWith({ path: 'pipeline.stages.0.steps', range, data: { foo: 'bar' } })
  })

  it('returns no lenses when the provided model is not the editor model', async () => {
    const getProvider = captureProvider()
    processOutlineModel.mockReturnValue(new Map())

    const editor = createFakeEditor()
    renderHookCompat(
      () => useCodeLenses({ editorRef: { current: editor } as unknown as EditorRef, inlineActions }),
      undefined
    )

    const otherModel = { uri: { toString: () => 'file://other' } } as unknown as monaco.editor.ITextModel
    const result = await getProvider()?.provideCodeLenses?.(otherModel, {} as monaco.CancellationToken)

    expect((result as monaco.languages.CodeLensList).lenses).toEqual([])
    expect(processOutlineModel).not.toHaveBeenCalled()
  })
})
