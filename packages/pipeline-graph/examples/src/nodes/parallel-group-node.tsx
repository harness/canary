import React from 'react'

import { ParallelNodeInternalType } from '../../../src/types/nodes-internal'

export interface ParallelGroupContentNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
  state?: 'success' | 'loading'
  selected?: boolean
}

export function ParallelGroupNodeContent(props: {
  node: ParallelNodeInternalType<ParallelGroupContentNodeDataType>
  children: React.ReactElement
}) {
  const { node, children } = props
  const data = node.data as ParallelGroupContentNodeDataType

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          inset: '0 0 0 0',
          pointerEvents: 'none'
        }}
        className={data?.state === 'loading' ? 'loading' : ''}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: '0px',
          right: '0px',
          left: '0px',
          height: '36px',
          wordBreak: 'break-all',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: 'rgb(153,153,153)',
            margin: '10px',
            display: 'inline-block',
            lineHeight: '12px',
            fontSize: '12px',
            paddingLeft: '30px'
          }}
        >
          Parallel - {node.path} ({node.children.length})
        </span>
      </div>
      {children}
    </div>
  )
}
