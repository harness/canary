import React from 'react'

export default function CustomPort(props: { side: 'left' | 'right'; id?: string; adjustment?: number }) {
  const { adjustment = 0 } = props

  const lineWeight = 2
  const r = 15

  return (
    <div
      id={props.id}
      style={{
        position: 'absolute',
        [props.side === 'left' ? 'left' : 'right']: `-${r / 2}px`,
        top: `calc( 50% - ${r / 2}px + ${adjustment}px)`,
        width: `${r}px`,
        height: `${r}px`,
        background: 'yellow',
        border: `${lineWeight}px solid red`,
        borderRadius: '50%',
        boxSizing: 'border-box'
      }}
    ></div>
  )
}
