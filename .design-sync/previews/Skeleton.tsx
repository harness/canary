import * as React from 'react'
import { Skeleton } from '@harnessio/ui'

const wrap = { padding: 16, width: 480 }

export function ListLoading() {
  return (
    <div style={wrap}>
      <Skeleton.List linesCount={4} hasActions />
    </div>
  )
}

export function TableLoading() {
  return (
    <div style={{ padding: 16, width: 560 }}>
      <Skeleton.Table countRows={4} countColumns={4} />
    </div>
  )
}

export function FormLoading() {
  return (
    <div style={wrap}>
      <Skeleton.Form linesCount={3} />
    </div>
  )
}

export function Primitives() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, width: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton.Avatar size="md" rounded />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <Skeleton.Typography variant="body-strong" className="w-40" />
          <Skeleton.Typography variant="caption-normal" className="w-24" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton.Icon size="md" />
        <Skeleton.Icon size="lg" />
        <Skeleton.Avatar size="lg" />
      </div>
    </div>
  )
}
