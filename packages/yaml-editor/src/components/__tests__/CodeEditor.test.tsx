import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { editorMockApi } from '../../../config/mocks/monaco-editor-react'
import { CodeEditor } from '../CodeEditor'

beforeEach(() => editorMockApi.reset())

const onChange = (value: string, versionId: number) =>
  (editorMockApi.lastProps?.onChange as (v: string, d: { versionId: number }) => void)(value, { versionId })

describe('CodeEditor', () => {
  it('mounts the editor, disables TS/JS diagnostics and writes the initial code via edits', () => {
    const tsSpy = vi.spyOn(editorMockApi.monaco.languages.typescript.typescriptDefaults, 'setDiagnosticsOptions')

    render(<CodeEditor codeRevision={{ code: 'hello' }} language="yaml" />)

    expect(tsSpy).toHaveBeenCalled()
    const editor = editorMockApi.lastEditor
    // Not readOnly -> code is applied through executeEdits wrapped in undo stops.
    expect(editor?.executeEdits).toHaveBeenCalled()
    expect(editor?.pushUndoStop).toHaveBeenCalled()
  })

  it('writes with setValue (no undo stops) when readOnly', () => {
    render(<CodeEditor codeRevision={{ code: 'ro' }} language="yaml" options={{ readOnly: true }} />)

    const editor = editorMockApi.lastEditor
    expect(editor?.setValue).toHaveBeenCalledWith('ro')
    expect(editor?.executeEdits).not.toHaveBeenCalled()
  })

  it('reports edits back through onCodeRevisionChange', () => {
    const onCodeRevisionChange = vi.fn()
    render(<CodeEditor codeRevision={{ code: '' }} language="yaml" onCodeRevisionChange={onCodeRevisionChange} />)

    act(() => onChange('new code', 7))

    expect(onCodeRevisionChange).toHaveBeenCalledWith(
      { code: 'new code', revisionId: 7 },
      expect.objectContaining({ versionId: 7 })
    )
  })

  it('injects line-selection styles only when enabled', () => {
    const { container, rerender } = render(
      <CodeEditor codeRevision={{ code: '' }} language="yaml" enableLinesSelection />
    )
    expect(container.querySelector('style')).not.toBeNull()

    editorMockApi.reset()
    rerender(<CodeEditor codeRevision={{ code: '' }} language="yaml" />)
    expect(container.querySelector('style')).toBeNull()
  })

  it('forwards the mounted editor through onMount', () => {
    const onMount = vi.fn()
    render(<CodeEditor codeRevision={{ code: '' }} language="yaml" onMount={onMount} />)
    expect(onMount).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })
})
