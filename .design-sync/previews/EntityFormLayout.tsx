import * as React from 'react'
import { Button, EntityFormLayout, Input, Text } from '@harnessio/ui'

export function CreateConnector() {
  return (
    <div style={{ width: 520, padding: 16 }}>
      <EntityFormLayout.Header>
        <EntityFormLayout.Title>New GitHub connector</EntityFormLayout.Title>
        <EntityFormLayout.Description>Connect a repository so pipelines can clone and report status.</EntityFormLayout.Description>
      </EntityFormLayout.Header>
      <EntityFormLayout.Form>
        <Input placeholder="Connector name" defaultValue="github-main" />
        <Input placeholder="Repository URL" defaultValue="https://github.com/acme/web" />
      </EntityFormLayout.Form>
      <EntityFormLayout.Footer>
        <Button variant="outline">Cancel</Button>
        <Button>Save connector</Button>
      </EntityFormLayout.Footer>
    </div>
  )
}

export function TitleOnly() {
  return (
    <div style={{ width: 520, padding: 16 }}>
      <EntityFormLayout.Header>
        <EntityFormLayout.Title>Rename pipeline</EntityFormLayout.Title>
      </EntityFormLayout.Header>
      <EntityFormLayout.Form>
        <Text className="block">Pipeline identifiers cannot be changed after creation.</Text>
        <Input defaultValue="build-and-deploy" />
      </EntityFormLayout.Form>
    </div>
  )
}
