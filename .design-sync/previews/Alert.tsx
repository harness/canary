import * as React from 'react'
import { Alert } from '@harnessio/ui'

const wrap: React.CSSProperties = { width: 560, padding: 16 }

export function Info() {
  return (
    <div style={wrap}>
      <Alert.Root theme="info">
        <Alert.Title>New pipeline template available</Alert.Title>
        <Alert.Description>The node-service template now includes caching and SBOM generation.</Alert.Description>
      </Alert.Root>
    </div>
  )
}

export function Success() {
  return (
    <div style={wrap}>
      <Alert.Root theme="success">
        <Alert.Title>Deployment succeeded</Alert.Title>
        <Alert.Description>payments-api v2.14.0 is live in production.</Alert.Description>
      </Alert.Root>
    </div>
  )
}

export function Warning() {
  return (
    <div style={wrap}>
      <Alert.Root theme="warning" dismissible>
        <Alert.Title>Delegate version is outdated</Alert.Title>
        <Alert.Description>2 delegates are running a version that will be unsupported next month.</Alert.Description>
      </Alert.Root>
    </div>
  )
}

export function Danger() {
  return (
    <div style={wrap}>
      <Alert.Root theme="danger">
        <Alert.Title>Pipeline execution failed</Alert.Title>
        <Alert.Description>Stage "integration-tests" exited with code 1 after 4m 12s.</Alert.Description>
      </Alert.Root>
    </div>
  )
}
