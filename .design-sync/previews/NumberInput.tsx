import * as React from 'react'
import { NumberInput } from '@harnessio/ui'

export function Default() {
  return <div style={{ width: 260, padding: 16 }}><NumberInput label="Parallel stages" defaultValue={4} /></div>
}
export function WithSuffix() {
  return <div style={{ width: 260, padding: 16 }}><NumberInput label="Timeout" suffix="min" defaultValue={30} integerOnly caption="Max run time per stage" /></div>
}
export function WithError() {
  return <div style={{ width: 260, padding: 16 }}><NumberInput label="Retries" defaultValue={-1} error="Must be 0 or greater" /></div>
}
export function Small() {
  return <div style={{ width: 260, padding: 16 }}><NumberInput size="sm" label="Replicas" defaultValue={3} hideStepper /></div>
}
