import * as React from 'react'
import { DateRangeV2 } from '@harnessio/ui'

function Demo({ open }: { open?: boolean }) {
  const [value, setValue] = React.useState<any>({
    range: { kind: 'relative', direction: 'last', amount: 7, unit: 'day' },
    from: new Date('2026-10-23T00:00:00Z'),
    to: new Date('2026-10-30T00:00:00Z')
  })
  return (
    <div style={{ padding: 16, width: 360 }}>
      <DateRangeV2 value={value} onValueChange={setValue} open={open} onOpenChange={() => {}} />
    </div>
  )
}

export function Closed() {
  return <Demo />
}

export function Empty() {
  return (
    <div style={{ padding: 16, width: 360 }}>
      <DateRangeV2 value={undefined} onValueChange={() => {}} placeholder="Select execution window" />
    </div>
  )
}

export function Open() {
  return <Demo open />
}
