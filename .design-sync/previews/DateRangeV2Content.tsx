import * as React from 'react'
import { DateRangeV2Content } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ padding: 16, width: 760 }}>
      <DateRangeV2Content onApply={() => {}} onCancel={() => {}} onClear={() => {}} />
    </div>
  )
}
