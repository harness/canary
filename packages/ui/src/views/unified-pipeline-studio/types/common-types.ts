export interface YamlRevision {
  yaml: string
  /** Monaco editor updates revision on every change.
   * YamlEditor hold current revision of monaco editor.
   * When yamlRevision prop is changes in compares yamlRevision.revision and internal current state.
   * If yamlRevision.revision is greater from current revision or if it's undefined,
   * it updates content. Otherwise it does nothing which prevent rerender.
   */
  revision?: number
}

export interface GlobalData {
  hideContextMenu?: boolean
  hideFloatingButtons?: boolean
}
