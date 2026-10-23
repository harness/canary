type AttributeList = readonly unknown[]
type AttributeMap = Record<string, AttributeList | undefined>

/**
 * A rehype plugin plus the class names it is allowed to leave on each tag.
 * Only `className` is opened. Tags, `style`, and event handlers stay on the default schema.
 */
export type MarkdownViewerPlugin<TPlugin = unknown> = {
  rehypePlugin: TPlugin
  allowedClasses?: Readonly<Record<string, readonly string[]>>
}

/**
 * Adds class names to a tag's existing `className` rule.
 * The sanitizer uses only the first rule, so a named list such as `li`'s `task-list-item` is extended
 * rather than replaced. A tag that already allows every class is left alone.
 */
export const withAllowedClasses = (
  existing: AttributeList | undefined,
  classNames: readonly string[]
): AttributeList => {
  const attributes = [...(existing ?? [])]
  const index = attributes.findIndex(
    entry => entry === 'className' || (Array.isArray(entry) && entry[0] === 'className')
  )
  const names = classNames.filter(className => className.length > 0)
  if (index === -1) return [['className', ...names], ...attributes]

  const entry = attributes[index]
  if (entry === 'className' || !Array.isArray(entry)) return attributes

  // Patterns such as `/^language-./` on `code` must stay patterns. Only string names are extended.
  const patterns = entry.slice(1).filter(item => typeof item !== 'string')
  const allowed = entry.slice(1).filter((item): item is string => typeof item === 'string')
  for (const className of names) {
    if (!allowed.includes(className)) allowed.push(className)
  }
  const next = attributes.slice()
  next[index] = ['className', ...patterns, ...allowed]
  return next
}

/** Unions `allowedClasses` from each plugin onto the sanitizer attribute map. */
export const applyAllowedClasses = (
  attributes: AttributeMap,
  plugins: ReadonlyArray<Pick<MarkdownViewerPlugin, 'allowedClasses'> | undefined>
): AttributeMap => {
  const classesByTag = new Map<string, string[]>()
  for (const plugin of plugins) {
    for (const [tag, classNames] of Object.entries(plugin?.allowedClasses ?? {})) {
      const current = classesByTag.get(tag) ?? []
      for (const className of classNames) {
        if (className && !current.includes(className)) current.push(className)
      }
      if (current.length > 0) classesByTag.set(tag, current)
    }
  }

  const next: AttributeMap = { ...attributes }
  for (const [tag, classNames] of classesByTag) {
    next[tag] = withAllowedClasses(next[tag], classNames)
  }
  return next
}
