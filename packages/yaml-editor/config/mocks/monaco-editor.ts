// Lightweight mock for monaco-editor used in vitest. Monaco doesn't load outside a browser env and the
// code under test references it both for types and for a small runtime surface (Range, a few editor/
// languages helpers). This stub provides just that surface. Methods are plain functions so tests can
// `vi.spyOn` them; stateful behaviour lives in the per-instance editor mock in monaco-editor-react.tsx.

export class Range {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
  constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) {
    this.startLineNumber = startLineNumber
    this.startColumn = startColumn
    this.endLineNumber = endLineNumber
    this.endColumn = endColumn
  }
}

export const Uri = {
  parse: (uri: string) => ({ toString: () => uri }),
  file: (path: string) => ({ toString: () => path })
}

export const editor = {
  getModelMarkers: (_filter: { resource?: unknown }) => [] as unknown[],
  onDidChangeMarkers: (_cb: (uris: unknown[]) => void) => ({ dispose: () => undefined }),
  defineTheme: (_name: string, _data: unknown) => undefined,
  setTheme: (_name: string) => undefined,
  getModels: () => [] as unknown[],
  InjectedTextCursorStops: { Both: 0, Right: 1, Left: 2, None: 3 }
}

export const languages = {
  SymbolKind: { Module: 1, Array: 17, String: 14 },
  registerCodeLensProvider: (_language: string, _provider: unknown) => ({ dispose: () => undefined }),
  typescript: {
    typescriptDefaults: { setDiagnosticsOptions: (_opts: unknown) => undefined },
    javascriptDefaults: { setDiagnosticsOptions: (_opts: unknown) => undefined }
  }
}

export default { Range, Uri, editor, languages }
