import React, { useEffect, useRef, useState } from 'react'

import { useGraphContext } from '../../../src/context/graph-provider'
import { LeafNodeInternalType } from '../../../src/types/nodes-internal'

export interface StepNodeDataType {
  yamlPath: string
  name: string
  icon?: React.ReactElement
}

export function SimpleStepNode(props: { node: LeafNodeInternalType<StepNodeDataType> }) {
  const { rerender } = useGraphContext()
  const { node } = props
  const data = node.data as StepNodeDataType

  const increment = useRef(Math.random() * 2)
  const size = useRef({ x: 150, y: 150 })

  const [_, setRerender] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      if (size.current.x > 200) increment.current = -Math.abs(increment.current)
      if (size.current.x < 100) increment.current = Math.abs(increment.current)

      size.current = { x: size.current.x + increment.current, y: size.current.y + increment.current }
      rerender()
    }, 33)

    setRerender(prev => prev + 1)
    return () => clearInterval(interval)
  }, [])

  const style: React.CSSProperties = {
    height: size.current.x + 'px',
    width: size.current.y + 'px',
    boxSizing: 'border-box',
    border: '1px solid #454545',
    borderRadius: '6px',
    wordBreak: 'break-all',
    fontSize: '11px',
    fontFamily: 'Verdana',
    background: 'linear-gradient(-47deg, rgba(152, 150, 172, 0.05) 0%, rgba(177, 177, 177, 0.15) 100%)',
    overflow: 'hidden'
  }

  const name = data?.name ?? 'Step'

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
