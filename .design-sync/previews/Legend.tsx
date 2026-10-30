import * as React from 'react'
import { Legend } from '@harnessio/ui'

export function Basic() {
  return <div style={{ padding: 16, width: 420 }}><Legend title="Deployment target" description="Choose the environment this pipeline deploys to." /></div>
}
export function TitleOnly() {
  return <div style={{ padding: 16, width: 420 }}><Legend title="Notifications" /></div>
}
