/**
 * Opt-in source positions for MarkdownViewer.
 *
 * When enabled, block elements get `data-line-start` and `data-line-end` (1-based lines in the
 * markdown `source`), so consumers can map rendered blocks back to source lines. Nested blocks
 * overlap (a list item inside a list, for example); consumers should use the innermost match.
 */

/** Hast tag names that carry source line ranges. */
export const SOURCE_POSITION_BLOCK_TAGS: ReadonlySet<string> = new Set([
  'p',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'pre',
  'blockquote',
  'table',
  'hr'
])

/** Hast property names written by the plugin and allowed through the sanitizer. */
export const SOURCE_POSITION_PROPERTIES = ['dataLineStart', 'dataLineEnd'] as const

type HastPosition = { start: { line: number }; end: { line: number } }

type HastNode = {
  type: string
  tagName?: string
  position?: HastPosition
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const annotate = (node: HastNode) => {
  if (node.type === 'element' && node.tagName && SOURCE_POSITION_BLOCK_TAGS.has(node.tagName) && node.position) {
    node.properties = {
      ...node.properties,
      dataLineStart: node.position.start.line,
      dataLineEnd: node.position.end.line
    }
  }

  node.children?.forEach(annotate)
}

/** Rehype plugin: copies each block element's source line range onto its properties. Run before sanitizing. */
export const rehypeSourcePositions = () => (tree: HastNode) => {
  annotate(tree)
}

/**
 * Turns the properties written by `rehypeSourcePositions` into DOM attributes for a rendered element.
 * Returns an empty object when the element has no source positions, so the DOM is unchanged.
 */
export const getSourcePositionAttributes = (node?: { properties?: Record<string, unknown> }) => {
  const start = node?.properties?.dataLineStart
  const end = node?.properties?.dataLineEnd

  if (typeof start !== 'number' || typeof end !== 'number') return {}

  return { 'data-line-start': start, 'data-line-end': end }
}
