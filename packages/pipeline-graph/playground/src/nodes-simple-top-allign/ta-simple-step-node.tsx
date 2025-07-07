import React from 'react'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface TAStepNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
}

export function TASimpleStepNode(props: { node: LeafNodeInternalType<TAStepNodeDataType> }) {
  const {
    node: { data }
  } = props

  const name = data?.name ?? 'Step'

  const style: React.CSSProperties = {
    height: '80px',
    width: '140px',
    boxSizing: 'border-box',
    border: '1px solid transparent',
    borderRadius: '6px',
    wordBreak: 'break-all',
    fontSize: '11px',
    fontFamily: 'Verdana',
    background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)'
  }

  return (
    <div title={name} style={style}>
      <div>{data?.icon}</div>
      <div style={{ margin: '10px' }} className={'node-text'}>
        <span>{name}</span>
        <br />
        <span className={'node-text'}>{props.node.path}</span>
      </div>
    </div>
  )
}
