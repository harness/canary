import cx from 'clsx'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { CommonNodeDataType } from '../types/nodes'

export interface StepNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
  state?: 'success' | 'loading'
  selected?: boolean
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const data = node.data as StepNodeDataType

  return (
    <div
      className={cx('-z-10 box-border size-full rounded-xl border bg-primary-foreground', {
        'border-borders-3': data.selected,
        'border-borders-6': !data.selected
      })}
    >
      <div>{data?.icon}</div>
      <div title={data.name} className="m-2 line-clamp-2 cursor-default text-primary">
        {data.name}
      </div>
    </div>
  )
}
