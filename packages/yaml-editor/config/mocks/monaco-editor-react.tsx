// Mock for @monaco-editor/react used in vitest. The real package renders a Monaco instance, which
// doesn't work in jsdom. This stub renders a plain <div>, calls `onMount` with a fake editor + the
// monaco-editor mock, and records the last props + editor on `editorMockApi` so tests can assert what
// the component passed down and drive `onChange` / inspect editor calls.

import { useEffect } from 'react'

import { vi } from 'vitest'

import monacoMock from './monaco-editor'

export interface FakeModel {
  getFullModelRange: ReturnType<typeof vi.fn>
  getValue: ReturnType<typeof vi.fn>
  setValue: ReturnType<typeof vi.fn>
  findMatches: ReturnType<typeof vi.fn>
  deltaDecorations: ReturnType<typeof vi.fn>
  uri: { toString: () => string }
}

export interface FakeEditor {
  model: FakeModel
  getModel: ReturnType<typeof vi.fn>
  setValue: ReturnType<typeof vi.fn>
  executeEdits: ReturnType<typeof vi.fn>
  pushUndoStop: ReturnType<typeof vi.fn>
  createDecorationsCollection: ReturnType<typeof vi.fn>
  changeViewZones: ReturnType<typeof vi.fn>
  onDidChangeMarkers: ReturnType<typeof vi.fn>
  onMouseDown: ReturnType<typeof vi.fn>
  revealLineInCenter: ReturnType<typeof vi.fn>
  revealLineInCenterIfOutsideViewport: ReturnType<typeof vi.fn>
  setPosition: ReturnType<typeof vi.fn>
  setSelection: ReturnType<typeof vi.fn>
  focus: ReturnType<typeof vi.fn>
  addCommand: ReturnType<typeof vi.fn>
}

export function createFakeEditor(): FakeEditor {
  const model: FakeModel = {
    getFullModelRange: vi.fn(() => new monacoMock.Range(1, 1, 1, 1)),
    getValue: vi.fn(() => ''),
    setValue: vi.fn(),
    findMatches: vi.fn(() => []),
    deltaDecorations: vi.fn(() => []),
    uri: { toString: () => 'file://model' }
  }
  return {
    model,
    getModel: vi.fn(() => model),
    setValue: vi.fn(),
    executeEdits: vi.fn(),
    pushUndoStop: vi.fn(),
    createDecorationsCollection: vi.fn(() => ({ set: vi.fn(), clear: vi.fn() })),
    changeViewZones: vi.fn((cb: (accessor: { addZone: ReturnType<typeof vi.fn> }) => void) => cb({ addZone: vi.fn() })),
    onDidChangeMarkers: vi.fn(() => ({ dispose: vi.fn() })),
    onMouseDown: vi.fn(() => ({ dispose: vi.fn() })),
    revealLineInCenter: vi.fn(),
    revealLineInCenterIfOutsideViewport: vi.fn(),
    setPosition: vi.fn(),
    setSelection: vi.fn(),
    focus: vi.fn(),
    addCommand: vi.fn(() => 'fake-command-id')
  }
}

export interface EditorMockApi {
  lastProps: Record<string, unknown> | null
  lastEditor: FakeEditor | null
  editors: FakeEditor[]
  monaco: typeof monacoMock
  reset: () => void
}

export const editorMockApi: EditorMockApi = {
  lastProps: null,
  lastEditor: null,
  editors: [],
  monaco: monacoMock,
  reset() {
    this.lastProps = null
    this.lastEditor = null
    this.editors = []
  }
}

type AnyProps = Record<string, unknown> & {
  className?: string
  language?: string
  theme?: string
  path?: string
  onMount?: (editor: FakeEditor, monaco: typeof monacoMock) => void
}

function EditorMockComponent(props: AnyProps) {
  useEffect(() => {
    const editor = createFakeEditor()
    editorMockApi.lastEditor = editor
    editorMockApi.editors.push(editor)
    editorMockApi.lastProps = props
    props.onMount?.(editor, monacoMock)
    // onMount should only fire once per mount, mirroring the real component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  editorMockApi.lastProps = props

  return (
    <div
      data-testid="monaco-editor"
      data-language={props.language}
      data-theme={props.theme}
      data-path={props.path}
      className={props.className}
    />
  )
}

const Editor = EditorMockComponent
export default Editor
export const DiffEditor = EditorMockComponent

export const useMonaco = () => monacoMock
export const loader = { config: (_opts: unknown) => undefined, init: () => Promise.resolve(monacoMock) }
