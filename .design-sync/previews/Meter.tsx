import * as React from 'react'
import { Meter } from '@harnessio/ui'

// MeterState: Error=1, Warning=2, Success=3, Info=4
export function RecentBuilds() {
  const data = [3, 3, 3, 1, 3, 3, 2, 3, 3, 3].map((state, i) => ({ id: 'b' + i, state: state as any }))
  return <div style={{ width: 240, padding: 16 }}><Meter data={data} /></div>
}
export function Partial() {
  const data = [3, 3, 4, 3].map((state, i) => ({ id: 'p' + i, state: state as any }))
  return <div style={{ width: 240, padding: 16 }}><Meter data={data} /></div>
}
export function Failing() {
  const data = [1, 1, 2, 1, 1, 3, 1, 1, 2, 1].map((state, i) => ({ id: 'f' + i, state: state as any }))
  return <div style={{ width: 240, padding: 16 }}><Meter data={data} /></div>
}
