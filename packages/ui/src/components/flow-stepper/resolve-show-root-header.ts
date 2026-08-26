export function resolveShowRootHeader(showRootHeader?: boolean, hideHeader?: boolean): boolean {
  if (showRootHeader !== undefined) return showRootHeader
  if (hideHeader !== undefined) return !hideHeader
  return true
}
