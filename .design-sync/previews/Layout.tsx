import * as React from 'react'
import { Layout, Text, Button } from '@harnessio/ui'

const chip = { padding: '8px 12px', border: '1px solid #8884', borderRadius: 6, fontSize: 13 } as React.CSSProperties

export function Vertical() {
  return (
    <Layout.Vertical gap="sm" style={{ padding: 16, width: 320 }}>
      <div style={chip}>build-and-test</div>
      <div style={chip}>security-scan</div>
      <div style={chip}>deploy-staging</div>
    </Layout.Vertical>
  )
}

export function Horizontal() {
  return (
    <Layout.Horizontal gap="md" align="center" style={{ padding: 16 }}>
      <Text>main</Text>
      <Button variant="outline" size="sm">Compare</Button>
      <Button size="sm">Open PR</Button>
    </Layout.Horizontal>
  )
}

export function Grid() {
  return (
    <Layout.Grid columns={3} gap="md" style={{ padding: 16, width: 480 }}>
      {['api-gateway','billing','web-app','auth','search','notifications'].map(r => <div key={r} style={chip}>{r}</div>)}
    </Layout.Grid>
  )
}

export function Flex() {
  return (
    <Layout.Flex justify="between" align="center" style={{ padding: 16, width: 480 }}>
      <Text>Pipeline executions</Text>
      <Button size="sm">Run</Button>
    </Layout.Flex>
  )
}
