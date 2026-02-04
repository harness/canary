import { HarnessLayout } from '../types/layout'
import { AnyNodeInternal } from '../types/nodes-internal'

export function findAdjustmentForHarnessLayout(
  node: AnyNodeInternal,
  getHeaderHeight: (node: AnyNodeInternal) => number,
  isCollapsed: (path: string) => boolean,
  layout: HarnessLayout
): number {
  // if collapsed or empty
  if (node.containerType !== 'leaf' && (isCollapsed(node.path) || ('children' in node && !node.children?.length))) {
    return (layout.collapsedPortPositionPerType?.[node.type] ?? 0) - (layout.leafPortPosition ?? 0)
  }

  const currAdj = getHeaderHeight(node)

  if ('children' in node && node.children[0]) {
    return currAdj + findAdjustmentForHarnessLayout(node.children[0], getHeaderHeight, isCollapsed, layout)
  }

  return currAdj
}
