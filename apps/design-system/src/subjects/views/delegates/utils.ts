export const isDelegateSelected = (delegateSelectors: string[], tags: string[] = []) => {
  if (!tags?.length) {
    return false
  }
  return tags?.some(tag => delegateSelectors.includes(tag))
}
