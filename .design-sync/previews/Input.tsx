import * as React from 'react'
import { Input } from '@harnessio/ui'

const box = { display: 'flex', flexDirection: 'column', gap: 16, padding: 16, width: 380 } as React.CSSProperties

export function Basic() {
  return (
    <div style={box}>
      <Input label="Pipeline name" placeholder="build-and-test" caption="Lowercase letters, numbers and hyphens." />
      <Input label="Repository" placeholder="Search repositories" inputIconName="search" />
    </div>
  )
}

export function States() {
  return (
    <div style={box}>
      <Input label="Branch" defaultValue="main" optional />
      <Input label="Webhook URL" defaultValue="not a url" error="Enter a valid https URL." />
      <Input label="Locked" defaultValue="prod-cluster" disabled />
    </div>
  )
}

export function Sizes() {
  return (
    <div style={box}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
    </div>
  )
}
