import React from 'react'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface StartNodeDataType {}

export function StartNode(_props: { node: LeafNodeInternalType<StartNodeDataType> }) {
  const style: React.CSSProperties = {
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: '-1',
    height: '60px',
    width: '60px',
    top: '50px',
    border: '1px solid #454545',
    borderRadius: '50%',
    background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return <div style={style}>START</div>
}
