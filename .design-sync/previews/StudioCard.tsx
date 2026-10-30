import * as React from 'react'
import { StudioCard, IconV2 } from '@harnessio/ui'

const noop = () => {}

export function SuccessStep() {
  return (
    <div style={{ padding: 16, width: 360 }}>
      <StudioCard.Root theme="success">
        <StudioCard.Header icon={<IconV2 name="git-branch" />} title="Clone repository" actions={<span />} />
        <StudioCard.Content>
          <StudioCard.Message message="Cloned acme/payments at a1b2c3d" />
        </StudioCard.Content>
        <StudioCard.Footer>
          <StudioCard.Status status="success">Succeeded</StudioCard.Status>
          <StudioCard.Button onClick={noop}>View output</StudioCard.Button>
        </StudioCard.Footer>
      </StudioCard.Root>
    </div>
  )
}

export function FailedStep() {
  return (
    <div style={{ padding: 16, width: 360 }}>
      <StudioCard.Root theme="danger" selected>
        <StudioCard.Header icon={<IconV2 name="play" />} title="Run unit tests" actions={<span />} />
        <StudioCard.Content>
          <StudioCard.Message message="3 tests failed in payments.spec.ts" />
        </StudioCard.Content>
        <StudioCard.Footer>
          <StudioCard.Status status="error">Failed</StudioCard.Status>
          <StudioCard.Button onClick={noop}>View logs</StudioCard.Button>
        </StudioCard.Footer>
      </StudioCard.Root>
    </div>
  )
}

export function RunningGroup() {
  return (
    <div style={{ padding: 16, width: 360 }}>
      <StudioCard.Root theme="info" isGroupCard execution>
        <StudioCard.Header icon={<IconV2 name="layers" />} title="Build stage" actions={<span />} />
        <StudioCard.Content>
          <StudioCard.Message message="Building and pushing image" />
        </StudioCard.Content>
        <StudioCard.Footer>
          <StudioCard.Status status="executing">Running</StudioCard.Status>
          <StudioCard.ExpandButton stepCount={4} label="steps" isExpanded={false} onToggle={noop} />
        </StudioCard.Footer>
      </StudioCard.Root>
    </div>
  )
}
