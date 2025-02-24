import React from 'react'

import { SerialNodeInternalType } from '../../../src/types/nodes-internal'

export interface SerialGroupContentNodeDataType {
  yamlPath: string
  name: string
}

export function SimpleSerialGroupNodeContent(props: {
  node: SerialNodeInternalType<SerialGroupContentNodeDataType>
  children: React.ReactElement
}) {
  const { children } = props

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          border: '1px dashed #454545',
          borderRadius: '6px',
          background: 'rgba(152, 150, 172, 0.01)'
        }}
      />
      {children}
    </div>
  )
}
