import * as React from 'react'
import { CalendarInputView } from '@harnessio/ui'

export function Empty() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <CalendarInputView setValue={() => {}} placeholder="Select a release date" />
    </div>
  )
}

export function WithValue() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <CalendarInputView value="Oct 14, 2026" setValue={() => {}} />
    </div>
  )
}
