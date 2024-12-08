import React from 'react'

import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface StepNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
  state?: 'success' | 'loading'
}

export function StepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { node } = props
  const data = node.data as StepNodeDataType

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

  const scaleStyle = {}
  // canvasZoom === "small"
  //   ? {
  //       background: "#3c3c3f",
  //       color: "transparent",
  //     }
  //   : {
  //       background: "initial",
  //       color: "inherit",
  //     };
  return (
    <div style={style} className={data.state === 'loading' ? 'loading' : ''}>
      {/* <div
        style={{
          position: "absolute",
          inset: "0 0 0 0",
          zIndex: -20,
          borderRadius: "6px",
        }}
        className={data.state === "loading" ? "loading" : ""}
      ></div> */}
      <div>{data?.icon}</div>
      <div style={{ margin: '10px' }} className={'node-text'}>
        <span style={scaleStyle}>{data?.name ?? 'Step'}</span>
        <br />
        <span style={scaleStyle} className={'node-text'}>
          {props.node.path}
        </span>
      </div>
    </div>
  )
}
