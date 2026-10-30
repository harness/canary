import * as React from 'react'
import { Button, ContainerHeader } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 640, padding: 16 }}>
      <ContainerHeader
        title="build-and-deploy"
        description="Builds the service image, runs unit tests and deploys to staging on every merge to main."
        actions={<Button>Run pipeline</Button>}
      />
    </div>
  )
}

export function WithCaption() {
  return (
    <div style={{ width: 640, padding: 16 }}>
      <ContainerHeader
        caption="Production / us-east-1"
        title="Deployment #482"
        description="Rolled out 3 of 5 replicas."
        actions={<Button variant="outline">Roll back</Button>}
      />
    </div>
  )
}

export function TitleOnly() {
  return (
    <div style={{ width: 640, padding: 16 }}>
      <ContainerHeader title="Pull requests" />
    </div>
  )
}
