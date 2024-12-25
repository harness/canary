import React from 'react'

import cx from 'classnames'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface StepNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
  state?: 'success' | 'loading'
  selected?: boolean
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const { data } = node

  const style: React.CSSProperties = {
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #454545',
    borderRadius: '6px',
    wordBreak: 'break-all',
    fontSize: '11px',
    fontFamily: 'Verdana',
    background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
  }

  const name = data.name ?? 'Step'

  return (
    <div
      title={name}
      style={style}
      className={cx('border', { loading: data.state === 'loading', selected: data.selected })}
    >
      <div>{data?.icon}</div>
      <div style={{ margin: '10px' }} className={'node-text'}>
        <span>{name}</span>
        <br />
        <span className={'node-text'}>{props.node.path}</span>
      </div>
    </div>
  )
}
