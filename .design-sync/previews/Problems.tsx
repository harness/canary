import * as React from 'react'
import { Problems } from '@harnessio/ui'

export function Default() {
  const problems: any[] = [
    { severity: 'error', message: 'Unknown field "stagess" in pipeline spec', position: { row: 4, column: 3 } },
    { severity: 'warning', message: 'Step "deploy" has no timeout set', position: { row: 18, column: 7 } },
    { severity: 'info', message: 'Consider using a shared connector', position: { row: 22, column: 5 } }
  ]
  return <div style={{ width: 520, padding: 16 }}><Problems problems={problems} onClick={() => {}} /></div>
}
export function ErrorsOnly() {
  const problems: any[] = [
    { severity: 'error', message: 'Missing required field "name"', position: { row: 1, column: 1 } },
    { severity: 'error', message: 'Invalid image reference', position: { row: 9, column: 12 } }
  ]
  return <div style={{ width: 520, padding: 16 }}><Problems problems={problems} onClick={() => {}} /></div>
}
