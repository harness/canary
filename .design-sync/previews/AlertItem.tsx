import * as React from 'react'
import { AlertItem } from '@harnessio/ui'

const wrap: React.CSSProperties = { width: 520, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }

export function Themes() {
  return (
    <div style={wrap}>
      <AlertItem theme="danger">
        <AlertItem.Title>Build failed on main</AlertItem.Title>
        <AlertItem.Description>checkout-service #482 failed in the test stage.</AlertItem.Description>
      </AlertItem>
      <AlertItem theme="warning">
        <AlertItem.Title>Delegate disconnected</AlertItem.Title>
        <AlertItem.Description>delegate-us-east-1 has not sent a heartbeat for 10 minutes.</AlertItem.Description>
      </AlertItem>
      <AlertItem theme="success">
        <AlertItem.Title>Deployment complete</AlertItem.Title>
        <AlertItem.Description>auth-service v1.9.2 reached production.</AlertItem.Description>
      </AlertItem>
      <AlertItem theme="info">
        <AlertItem.Title>Review requested</AlertItem.Title>
        <AlertItem.Description>Dana asked you to review PR #1204.</AlertItem.Description>
      </AlertItem>
    </div>
  )
}

export function ReadAndUnread() {
  return (
    <div style={wrap}>
      <AlertItem theme="info" read={false} timestamp={Date.now() - 5 * 60 * 1000}>
        <AlertItem.Title>Unread: pipeline approved</AlertItem.Title>
        <AlertItem.Description>Production deploy approved by Priya.</AlertItem.Description>
      </AlertItem>
      <AlertItem theme="info" read timestamp={Date.now() - 3 * 3600 * 1000}>
        <AlertItem.Title>Read: scheduled run finished</AlertItem.Title>
        <AlertItem.Description>Nightly regression run completed in 18m.</AlertItem.Description>
      </AlertItem>
    </div>
  )
}
