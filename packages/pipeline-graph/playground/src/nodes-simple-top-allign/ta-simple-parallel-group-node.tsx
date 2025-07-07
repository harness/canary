import React from 'react'

import { useGraphContext } from '../../../src'
import { ParallelNodeInternalType } from '../../../src/types/nodes-internal'

export interface TAParallelGroupContentNodeDataType {
  yamlPath: string
  name: string
}

export function TASimpleParallelGroupNodeContent(props: {
  node: ParallelNodeInternalType<TAParallelGroupContentNodeDataType>
  children: React.ReactElement
}) {
  const {
    children,
    node: { path }
  } = props

  const { collapse, isCollapsed } = useGraphContext()

  const collapsed = isCollapsed(path)

  return (
    <div style={{ width: '100%' }}>
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
      <div
        style={{
          height: '62px',
          background: 'gray',
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        HEADER
      </div>
      <div
        style={{ margin: '10px', textAlign: 'center' }}
        onClick={() => {
          collapse(path, !collapsed)
        }}
      >
        {collapsed ? 'OPEN' : 'CLOSE'}
      </div>
      {!collapsed && <div style={{ margin: '20px' }}> {children}</div>}
    </div>
  )
}
