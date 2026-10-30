import * as React from 'react'
import { Stepper, Text } from '@harnessio/ui'

export function PipelineSetup() {
  const [value, setValue] = React.useState('repo')
  return (
    <div style={{ padding: 16, width: 520 }}>
      <Stepper.Root value={value} onValueChange={setValue} title="Create pipeline">
        <Stepper.Step value="source" title="Connect repository" description="github.com/acme/payments" state="completed" />
        <Stepper.Step value="repo" title="Choose template" description="Pick a starting pipeline" state="active">
          <Text>Node.js build and test template selected.</Text>
        </Stepper.Step>
        <Stepper.Step value="env" title="Configure environments" state="upcoming" />
        <Stepper.Step value="review" title="Review and create" state="upcoming" />
      </Stepper.Root>
    </div>
  )
}

export function WithGroupsAndError() {
  const [value, setValue] = React.useState('deploy')
  return (
    <div style={{ padding: 16, width: 520 }}>
      <Stepper.Root value={value} onValueChange={setValue} showConnectors>
        <Stepper.Step value="build" title="Build" description="Completed in 2m 10s" state="completed" />
        <Stepper.Step value="test" title="Test" description="148 tests passed" state="completed" />
        <Stepper.Step value="deploy" title="Deploy to staging" description="Health check failed" state="error" />
        <Stepper.Step value="prod" title="Deploy to production" state="skipped" />
      </Stepper.Root>
    </div>
  )
}
