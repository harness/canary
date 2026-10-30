import * as React from 'react'
import { InputOTP } from '@harnessio/ui'

export function SixDigit() {
  return (
    <div style={{ padding: 16 }}>
      <InputOTP.Root maxLength={6} value="428">
        <InputOTP.Group>
          <InputOTP.Slot index={0} /><InputOTP.Slot index={1} /><InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} /><InputOTP.Slot index={4} /><InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP.Root>
    </div>
  )
}

export function Filled() {
  return (
    <div style={{ padding: 16 }}>
      <InputOTP.Root maxLength={4} value="7391">
        <InputOTP.Group>
          <InputOTP.Slot index={0} /><InputOTP.Slot index={1} /><InputOTP.Slot index={2} /><InputOTP.Slot index={3} />
        </InputOTP.Group>
      </InputOTP.Root>
    </div>
  )
}
