import * as React from 'react'
import { DualPaneStepper } from '@harnessio/ui'

function Repo() {
  return (
    <DualPaneStepper.Card title="Choose repository" description="Select the repository to build.">
      <div>acme/web-app</div>
    </DualPaneStepper.Card>
  )
}
function Env() {
  return (
    <DualPaneStepper.Card title="Target environment" description="Where should this pipeline deploy?">
      <div>staging, production</div>
    </DualPaneStepper.Card>
  )
}
function Review() {
  return (
    <DualPaneStepper.Card title="Review and create">
      <div>Pipeline build-and-deploy will be created.</div>
    </DualPaneStepper.Card>
  )
}

const flow: any = {
  initialStep: 'repo',
  steps: {
    repo: { title: 'Repository', description: 'Pick a source', component: Repo, next: 'env' },
    env: { title: 'Environment', description: 'Pick a target', component: Env, next: 'review' },
    review: { title: 'Review', description: 'Confirm', component: Review, terminal: true }
  }
}

export function PipelineSetup() {
  return (
    <div style={{ width: 720, height: 460 }}>
      <DualPaneStepper.Root flow={flow} title="Create pipeline" contentTitle="Create pipeline" contentSubtitle="Three steps to your first run" onComplete={() => {}} onClose={() => {}} />
    </div>
  )
}

export function CardAction() {
  return (
    <div style={{ width: 520, padding: 16 }}>
      <DualPaneStepper.CardAction variant="warning" message="The production environment requires an approval rule." actionLabel="Add rule" onAction={() => {}} secondaryLabel="Skip" onSecondary={() => {}} />
    </div>
  )
}
