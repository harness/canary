import { AnyNodeInternal } from './nodes-internal'

export type GetPortSvgFuncType = (props: {
  targetNode?: AnyNodeInternal
  collapsed: boolean
  position: 'source' | 'target'
  x: number
  y: number
}) => {
  portSvg: string
  rightGap: number
}
