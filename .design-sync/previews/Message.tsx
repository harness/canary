import * as React from 'react'
import { Message } from '@harnessio/ui'

export function Default() {
  return <div style={{ padding: 16 }}><Message theme={'default' as any}>Pipeline runs on every push to main.</Message></div>
}
export function Success() {
  return <div style={{ padding: 16 }}><Message theme={'success' as any}>Connector verified successfully.</Message></div>
}
export function Warning() {
  return <div style={{ padding: 16 }}><Message theme={'warning' as any}>Token expires in 3 days.</Message></div>
}
export function Error() {
  return <div style={{ padding: 16 }}><Message theme={'error' as any}>Pipeline name is already in use.</Message></div>
}
