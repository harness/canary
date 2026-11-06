import * as monaco from 'monaco-editor'

export interface InlineAction<T> {
  title: string
  onClick: (args: { path: string; range: monaco.IRange; data: T }) => void
  data?: T
  /**
   * Optional visibility guard evaluated per matched path. Return `false` to suppress this action for a
   * given match while keeping it for others. Receives the matched `path` and its `DocumentSymbol`, so
   * callers can discriminate on the value's shape — e.g. `symbol.kind` (an `Array` real steps list vs a
   * `String` scalar reference), `symbol.detail`, or `symbol.name` — which a path selector alone cannot.
   */
  shouldShow?: (args: { path: string; symbol: monaco.languages.DocumentSymbol }) => boolean
}
