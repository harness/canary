export const getShadowActiveElement = (rootEl: HTMLElement) => {
  const rootNode = rootEl.getRootNode()

  return {
    isShadowRoot: rootNode instanceof ShadowRoot,
    activeEl: rootNode instanceof ShadowRoot ? rootNode.activeElement : document.activeElement
  }
}
