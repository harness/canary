import * as React from 'react'
import { Button, ButtonLayout } from '@harnessio/ui'

export function Variants() {
  return (
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,padding:16}}>
      <Button variant="primary">Run pipeline</Button>
      <Button variant="secondary">Save draft</Button>
      <Button variant="outline">Add filter</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="transparent">Reset</Button>
      <Button variant="link">View logs</Button>
      <Button variant="ai">Ask Harness AI</Button>
    </div>
  )
}

export function Themes() {
  return (
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,padding:16}}>
      <Button theme="default">Deploy</Button>
      <Button theme="success">Approve</Button>
      <Button theme="warning">Override gate</Button>
      <Button theme="danger">Delete pipeline</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,padding:16}}>
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
    </div>
  )
}

export function States() {
  return (
    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,padding:16}}>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button rounded>Rounded</Button>
    </div>
  )
}

export function InLayout() {
  return (
    <div style={{padding:16}}>
      <ButtonLayout>
        <Button variant="outline">Cancel</Button>
        <Button>Create connector</Button>
      </ButtonLayout>
    </div>
  )
}
