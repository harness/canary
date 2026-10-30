import * as React from 'react'
import { Button, SinglePaneStepper, Text, useFlowCard } from '@harnessio/ui'

function RepoCard() {
  const { complete } = useFlowCard()
  return (
    <SinglePaneStepper.Card title="Select repository" description="Pick the repo to build">
      <Text>harness/gateway</Text>
      <Button onClick={() => complete({ repo: 'gateway' })}>Continue</Button>
    </SinglePaneStepper.Card>
  )
}
function EnvCard() {
  const { complete } = useFlowCard()
  return (
    <SinglePaneStepper.Card title="Choose environment" description="Where to deploy">
      <Text>staging</Text>
      <Button onClick={() => complete({ env: 'staging' })}>Continue</Button>
    </SinglePaneStepper.Card>
  )
}
function ReviewCard() {
  return (
    <SinglePaneStepper.Card title="Review" description="Confirm the setup">
      <Text>Ready to create pipeline</Text>
    </SinglePaneStepper.Card>
  )
}

export function Grouped() {
  return (
    <SinglePaneStepper.Root
      style={{ height: 460 }}
      title="Create pipeline"
      flow={{
        initialStep: 'repo',
        stepGroups: {
          source: { title: 'Source', description: 'Where code lives' },
          target: { title: 'Target', description: 'Where it ships' },
          confirm: { title: 'Confirm', description: 'Review and create' }
        },
        steps: {
          repo: { step: 'source', title: 'Repository', component: RepoCard, next: 'env' },
          env: { step: 'target', title: 'Environment', component: EnvCard, next: 'review' },
          review: { step: 'confirm', title: 'Review', component: ReviewCard, terminal: true }
        }
      }}
    />
  )
}
