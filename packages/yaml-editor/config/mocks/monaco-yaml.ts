// Lightweight mock for monaco-yaml used in vitest. See monaco-editor.ts for rationale.
// setDiagnosticsOptions persists the schemas back onto diagnosticsOptions so schema-utils is observable in tests.

interface SchemaEntry {
  fileMatch: string[]
  schema: unknown
  uri: string
}

export const yamlDefaults: {
  diagnosticsOptions: { schemas: SchemaEntry[] }
  setDiagnosticsOptions: (opts: { schemas: SchemaEntry[] }) => void
} = {
  diagnosticsOptions: { schemas: [] },
  setDiagnosticsOptions(opts) {
    this.diagnosticsOptions = { ...this.diagnosticsOptions, schemas: opts.schemas }
  }
}

export default { yamlDefaults }
