import * as React from 'react'
import { Calendar } from '@harnessio/ui'

export function Single() {
  return (
    <div style={{ padding: 16 }}>
      <Calendar mode="single" defaultMonth={new Date(2026, 9, 1)} selected={new Date(2026, 9, 14)} />
    </div>
  )
}

export function Range() {
  return (
    <div style={{ padding: 16 }}>
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 9, 1)}
        selected={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 12) } as any}
      />
    </div>
  )
}
