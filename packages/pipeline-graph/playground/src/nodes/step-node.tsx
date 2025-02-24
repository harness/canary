import React from 'react'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'
import { createRoundedRectPath } from './utils/utils'

export interface StepNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
  state?: 'success' | 'executing' | 'executed'
  selected?: boolean
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const { data } = node

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

  const name = data.name ?? 'Step'

  return (
    <div
      title={name}
      style={style}
      // className={cx('border', { loading: data.state === 'loading', selected: data.selected })}
    >
      <div>{data?.icon}</div>
      <div style={{ margin: '10px' }} className={'node-text'}>
        <span>{name}</span>
        {/* <br />
        <span className={'node-text'}>{props.node.path}</span> */}
      </div>

      <svg
        viewBox="0 0 140 80"
        style={{ position: 'absolute', zIndex: '-10', top: '0px', left: '0px', overflow: 'visible' }}
      >
        <path d={createRoundedRectPath(0, 0, 140, 80, 5)} strokeWidth={'1'} stroke="#454545" fill="none"></path>
      </svg>

      {node.data.state === 'executing' && (
        <svg
          viewBox="0 0 140 80"
          style={{ position: 'absolute', zIndex: '-10', top: '0px', left: '0px', overflow: 'visible' }}
        >
          <path
            d={createRoundedRectPath(0, 0, 140, 80, 5)}
            strokeWidth={'1'}
            stroke="#43b5e6"
            fill="none"
            className="PipelineGraph-AnimateNode"
            stroke-dasharray={280 + 160}
            stroke-dashoffset={280 + 160}
          ></path>
        </svg>
      )}

      {node.data.state === 'executed' && (
        <svg
          viewBox="0 0 140 80"
          style={{ position: 'absolute', zIndex: '-8', top: '0px', left: '0px', overflow: 'visible' }}
        >
          <path d={createRoundedRectPath(0, 0, 140, 80, 5)} strokeWidth={'1'} stroke="#43b5e6" fill="none"></path>
        </svg>
      )}
    </div>
  )
}
