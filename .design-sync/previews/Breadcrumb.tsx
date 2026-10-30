import * as React from 'react'
import { Breadcrumb } from '@harnessio/ui'

const wrap: React.CSSProperties = { padding: 16 }

export function Default() {
  return (
    <div style={wrap}>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="#">Acme</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Link href="#">payments-api</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Link href="#">Pipelines</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Page>build-and-deploy</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>
  )
}

export function Small() {
  return (
    <div style={wrap}>
      <Breadcrumb.Root size="xs">
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="#">Repositories</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Link href="#">checkout-service</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Page>Pull request #1204</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>
  )
}
