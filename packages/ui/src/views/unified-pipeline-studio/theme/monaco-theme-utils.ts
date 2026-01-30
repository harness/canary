import { editor } from 'monaco-editor'

/**
 * Reads a CSS variable value from the document.
 * Returns the value without the # prefix (Monaco format).
 */
export function getCSSVariable(name: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  // Remove # prefix if present (Monaco expects colors without #)
  return value.replace('#', '')
}

/**
 * CSS variable names for Monaco Editor tokens
 */
export const MONACO_CSS_VARIABLES = {
  // Editor colors
  foreground: '--cn-comp-monaco-foreground',
  background: '--cn-comp-monaco-background',
  selection: '--cn-comp-monaco-selection',
  lineHighlight: '--cn-comp-monaco-line-highlight',
  cursor: '--cn-comp-monaco-cursor',
  whitespace: '--cn-comp-monaco-whitespace',
  // Syntax highlighting
  key: '--cn-comp-monaco-key',
  string: '--cn-comp-monaco-string',
  number: '--cn-comp-monaco-number',
  boolean: '--cn-comp-monaco-boolean',
  comment: '--cn-comp-monaco-comment',
  tag: '--cn-comp-monaco-tag',
  delimiter: '--cn-comp-monaco-delimiter',
  anchor: '--cn-comp-monaco-anchor',
  function: '--cn-comp-monaco-function',
  constant: '--cn-comp-monaco-constant',
  // Invalid tokens
  invalidBg: '--cn-comp-monaco-invalid-bg',
  invalidText: '--cn-comp-monaco-invalid-text',
  // Diff colors
  diffInserted: '--cn-comp-monaco-diff-inserted',
  diffDeleted: '--cn-comp-monaco-diff-deleted',
  diffHeaderBg: '--cn-comp-monaco-diff-header-bg',
  diffRange: '--cn-comp-monaco-diff-range',
  // Line numbers
  lineNumber: '--cn-comp-monaco-line-number',
  lineNumberActive: '--cn-comp-monaco-line-number-active'
} as const

/**
 * Creates Monaco Editor theme data from CSS variables.
 * Call this function after DOM is ready and when theme changes.
 *
 * @param base - Monaco base theme ('vs' for light, 'vs-dark' for dark)
 * @returns Monaco theme data with colors from CSS variables
 */
export function createMonacoThemeFromCSS(base: 'vs' | 'vs-dark'): editor.IStandaloneThemeData {
  // Read all Monaco token colors from CSS variables
  const monaco = {
    // Editor colors
    foreground: getCSSVariable(MONACO_CSS_VARIABLES.foreground),
    background: getCSSVariable(MONACO_CSS_VARIABLES.background),
    selection: getCSSVariable(MONACO_CSS_VARIABLES.selection),
    lineHighlight: getCSSVariable(MONACO_CSS_VARIABLES.lineHighlight),
    cursor: getCSSVariable(MONACO_CSS_VARIABLES.cursor),
    whitespace: getCSSVariable(MONACO_CSS_VARIABLES.whitespace),
    // Syntax highlighting
    key: getCSSVariable(MONACO_CSS_VARIABLES.key),
    string: getCSSVariable(MONACO_CSS_VARIABLES.string),
    number: getCSSVariable(MONACO_CSS_VARIABLES.number),
    boolean: getCSSVariable(MONACO_CSS_VARIABLES.boolean),
    comment: getCSSVariable(MONACO_CSS_VARIABLES.comment),
    tag: getCSSVariable(MONACO_CSS_VARIABLES.tag),
    delimiter: getCSSVariable(MONACO_CSS_VARIABLES.delimiter),
    anchor: getCSSVariable(MONACO_CSS_VARIABLES.anchor),
    function: getCSSVariable(MONACO_CSS_VARIABLES.function),
    constant: getCSSVariable(MONACO_CSS_VARIABLES.constant),
    // Invalid tokens
    invalidBg: getCSSVariable(MONACO_CSS_VARIABLES.invalidBg),
    invalidText: getCSSVariable(MONACO_CSS_VARIABLES.invalidText),
    // Diff colors
    diffInserted: getCSSVariable(MONACO_CSS_VARIABLES.diffInserted),
    diffDeleted: getCSSVariable(MONACO_CSS_VARIABLES.diffDeleted),
    diffHeaderBg: getCSSVariable(MONACO_CSS_VARIABLES.diffHeaderBg),
    diffRange: getCSSVariable(MONACO_CSS_VARIABLES.diffRange),
    // Line numbers
    lineNumber: getCSSVariable(MONACO_CSS_VARIABLES.lineNumber),
    lineNumberActive: getCSSVariable(MONACO_CSS_VARIABLES.lineNumberActive)
  }

  return {
    base,
    inherit: true,
    rules: [
      { background: monaco.background, token: '' },
      { foreground: monaco.comment, token: 'comment' },
      { foreground: monaco.constant, token: 'keyword.operator.class' },
      { foreground: monaco.constant, token: 'constant.other' },
      { foreground: monaco.constant, token: 'source.php.embedded.line' },
      { foreground: monaco.anchor, token: 'variable' },
      { foreground: monaco.anchor, token: 'support.other.variable' },
      { foreground: monaco.anchor, token: 'string.other.link' },
      { foreground: monaco.anchor, token: 'string.regexp' },
      { foreground: monaco.anchor, token: 'entity.name.tag' },
      { foreground: monaco.key, token: 'entity.other.attribute-name' },
      { foreground: monaco.anchor, token: 'meta.tag' },
      { foreground: monaco.anchor, token: 'declaration.tag' },
      { foreground: monaco.diffDeleted, token: 'markup.deleted.git_gutter' },
      { foreground: monaco.number, token: 'constant.numeric' },
      { foreground: monaco.number, token: 'constant.language' },
      { foreground: monaco.number, token: 'support.constant' },
      { foreground: monaco.number, token: 'constant.character' },
      { foreground: monaco.key, token: 'variable.parameter' },
      { foreground: monaco.key, token: 'punctuation.section.embedded' },
      { foreground: monaco.number, token: 'keyword.other.unit' },
      { foreground: monaco.tag, token: 'entity.name.class' },
      { foreground: monaco.tag, token: 'entity.name.type.class' },
      { foreground: monaco.tag, token: 'support.type' },
      { foreground: monaco.tag, token: 'support.class' },
      { foreground: monaco.string, token: 'string' },
      { foreground: monaco.string, token: 'constant.other.symbol' },
      { foreground: monaco.string, token: 'entity.other.inherited-class' },
      { foreground: monaco.string, token: 'markup.heading' },
      { foreground: monaco.diffInserted, token: 'markup.inserted.git_gutter' },
      { foreground: monaco.delimiter, token: 'keyword.operator' },
      { foreground: monaco.delimiter, token: 'constant.other.color' },
      { foreground: monaco.function, token: 'entity.name.function' },
      { foreground: monaco.function, token: 'meta.function-call' },
      { foreground: monaco.function, token: 'support.function' },
      { foreground: monaco.function, token: 'keyword.other.special-method' },
      { foreground: monaco.function, token: 'meta.block-level' },
      { foreground: monaco.function, token: 'markup.changed.git_gutter' },
      { foreground: monaco.boolean, token: 'keyword' },
      { foreground: monaco.boolean, token: 'storage' },
      { foreground: monaco.boolean, token: 'storage.type' },
      { foreground: monaco.boolean, token: 'entity.name.tag.css' },
      { foreground: monaco.invalidText, background: monaco.invalidBg, token: 'invalid' },
      { foreground: monaco.invalidText, background: monaco.diffHeaderBg, token: 'meta.separator' },
      { foreground: monaco.invalidText, background: monaco.invalidBg, token: 'invalid.deprecated' },
      { foreground: monaco.diffInserted, token: 'markup.inserted.diff' },
      { foreground: monaco.diffDeleted, token: 'markup.deleted.diff' },
      { foreground: monaco.foreground, background: monaco.diffHeaderBg, token: 'meta.diff.header.from-file' },
      { foreground: monaco.foreground, background: monaco.diffHeaderBg, token: 'meta.diff.header.to-file' },
      { foreground: monaco.diffRange, fontStyle: 'italic', token: 'meta.diff.range' },
      { foreground: monaco.key, token: 'type' },
      { foreground: monaco.number, token: 'number' }
    ],
    colors: {
      'editor.foreground': `#${monaco.foreground}`,
      'editor.background': `#${monaco.background}`,
      'editor.selectionBackground': `#${monaco.selection}`,
      'editor.lineHighlightBackground': `#${monaco.lineHighlight}`,
      'editorCursor.foreground': `#${monaco.cursor}`,
      'editorWhitespace.foreground': `#${monaco.whitespace}`,
      'editorLineNumber.foreground': `#${monaco.lineNumber}`,
      'editorLineNumber.activeForeground': `#${monaco.lineNumberActive}`
    }
  }
}
