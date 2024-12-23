import { SerialNodeInternalType } from '@harnessio/pipeline-graph'

import { CommonNodeDataType } from '../types/nodes'

export interface SerialGroupContentNodeDataType extends CommonNodeDataType {
  icon?: React.ReactElement
}

export function SerialGroupContentNode(props: {
  node: SerialNodeInternalType<SerialGroupContentNodeDataType>
  children: React.ReactElement
}) {
  const { node, children } = props
  const data = node.data as SerialGroupContentNodeDataType

  return (
    <>
      <div className="absolute inset-0 -z-10 rounded-xl border border-dashed border-borders-6 bg-primary-foreground/30"></div>
      <div className="absolute inset-0 flex h-9 items-center">
        <div title={data.name} className="m-3 h-9 cursor-default truncate pl-8 pt-2.5 text-primary-muted">
          {data.name}
        </div>
      </div>
      {children}
    </>
  )
}
