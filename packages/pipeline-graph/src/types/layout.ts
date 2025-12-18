import { AnyNodeInternal } from './nodes-internal'

export interface CenterLayout {
  type: 'center'
}

export interface TopLayout {
  type: 'top'
  portPosition?: number
}

export interface HarnessLayout {
  type: 'harness'
  leafPortPosition?: number
  collapsedPortPositionPerType?: Record<string, number>
  getHeaderHeight?: (node: AnyNodeInternal) => number
}

export type LayoutConfig = CenterLayout | TopLayout | HarnessLayout
