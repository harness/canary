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
  const { data } = node

  const name = `Parallel - ${node.path} (${node.children.length})`

  return (
    <div title={name}>
      <div
        className={cx('border', { loading: data.state === 'loading', selected: data.selected })}
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
          {name}
        </span>
      </div>
      <div style={{ position: 'absolute', top: '5px', left: '5px' }}>
        <CollapseButton collapsed={collapsed} onCollapseChange={setCollapsed} />
      </div>
      {children}
    </div>
  )
}
