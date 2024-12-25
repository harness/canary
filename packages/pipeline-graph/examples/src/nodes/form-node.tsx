import React from 'react'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface FormNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
  state?: 'success' | 'loading'
}

export function FormNode(props: { node: LeafNodeInternalType<FormNodeDataType> }) {
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

  return (
    <div style={style} className={data.state === 'loading' ? 'loading' : ''}>
      <div>{data.icon}</div>
      <div style={{ margin: '10px' }}>
        <span>{data.name ?? 'Step'}</span>
        <br />
        <input type="checkbox"></input>
        <input style={{ width: '100%' }}></input>
      </div>
    </div>
  )
}
