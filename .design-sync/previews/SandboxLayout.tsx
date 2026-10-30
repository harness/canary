import * as React from 'react'
import { SandboxLayout, Text } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ height: 420, width: 900 }}>
      <SandboxLayout.Root>
        <SandboxLayout.Main>
          <SandboxLayout.SubHeader><Text variant="heading-base">Pipelines</Text></SandboxLayout.SubHeader>
          <SandboxLayout.Content maxWidth="4xl">
            <Text>deploy-api, build-web, nightly-e2e</Text>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </SandboxLayout.Root>
    </div>
  )
}

export function Columns() {
  return (
    <div style={{ height: 420, width: 900 }}>
      <SandboxLayout.Root>
        <SandboxLayout.Main>
          <SandboxLayout.Content>
            <SandboxLayout.Columns columnWidths="2fr 1fr">
              <SandboxLayout.Column><Text>Pull request description and timeline</Text></SandboxLayout.Column>
              <SandboxLayout.Column><Text>Reviewers: Priya, Marcus</Text></SandboxLayout.Column>
            </SandboxLayout.Columns>
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      </SandboxLayout.Root>
    </div>
  )
}
