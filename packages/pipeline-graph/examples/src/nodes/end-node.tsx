import React from 'react'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface EndNodeDataType {}

export function EndNode(_props: { node: LeafNodeInternalType<EndNodeDataType> }) {
  const style: React.CSSProperties = {
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
    border: '1px solid #454545',
    borderRadius: '50%',
    background: 'linear-gradient(-45deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return <div style={style}>END</div>
}
