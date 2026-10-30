import * as React from 'react'
import { Progress } from '@harnessio/ui'

export function Default() {
  return <div style={{ width: 360, padding: 16 }}><Progress value={0.64} label="Build progress" description="Running stage 3 of 5" /></div>
}
export function States() {
  return (
    <div style={{ width: 360, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Progress value={1.0} state="completed" label="Deploy to production" />
      <Progress value={0.4} state="failed" label="Integration tests" />
      <Progress value={0.55} state="paused" label="Awaiting approval" />
    </div>
  )
}
export function Indeterminate() {
  return <div style={{ width: 360, padding: 16 }}><Progress variant="indeterminate" label="Cloning repository" /></div>
}
export function Sizes() {
  return (
    <div style={{ width: 360, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Progress size="sm" value={0.3} label="Small" />
      <Progress size="md" value={0.5} label="Medium" />
      <Progress size="lg" value={0.8} label="Large" />
    </div>
  )
}
