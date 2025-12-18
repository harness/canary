import React from 'react'

import cx from 'classnames'
import { noop } from 'lodash-es'

import { ParallelNodeInternalType } from '../../../src/types/nodes-internal'
import { CollapseButton } from './components/collapse-button'

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
  collapsed?: boolean
  setCollapsed?: (collapsed: boolean) => void
}) {
  const { node, children, collapsed = false, setCollapsed = noop } = props

  const name = `Parallel - ${node.path} (${node.children.length})`

  return (
    <div
      title={name}
      style={{
        boxSizing: 'border-box',
        border: '1px dashed #454545',
        borderRadius: '6px',
        background: 'rgba(152, 150, 172, 0.01)'
      }}
    >
      <div
        style={{
          height: '100px',
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
          {name}
        </span>
      </div>
      <div style={{ position: 'absolute', top: '5px', left: '5px' }}>
        <CollapseButton collapsed={collapsed} onCollapseChange={setCollapsed} />
      </div>
      <div style={{ padding: '20px' }}> {children}</div>
    </div>
  )
}
