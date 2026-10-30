import * as React from 'react'
import { Button, ButtonLayout, SinglePaneStepperV2, TextInput, TooltipProvider, useFlowCard } from '@harnessio/ui'

function NameCard() {
  const { complete } = useFlowCard<{ answer?: string }>()
  const [value, setValue] = React.useState('payments-deploy')
  return (
    <SinglePaneStepperV2.Card title="What should we name this pipeline?" description="Use a stable identifier.">
      <TextInput value={value} onChange={(e: any) => setValue(e.target.value)} />
      <ButtonLayout.Root>
        <Button onClick={() => complete({ answer: value })}>Continue</Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  )
}

function EnvCard() {
  const { complete } = useFlowCard<{ answer?: string }>()
  return (
    <SinglePaneStepperV2.Card title="Where should it deploy first?" description="Start somewhere safe.">
      <ButtonLayout.Root>
        <Button variant="outline" onClick={() => complete({ answer: 'Staging' })}>Staging</Button>
        <Button onClick={() => complete({ answer: 'Production' })}>Production</Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  )
}

const flow: any = {
  initialStep: 'name',
  steps: {
    name: { title: 'What should we name this pipeline?', component: NameCard, next: 'env' },
    env: { title: 'Where should it deploy first?', component: EnvCard }
  }
}

export function Onboarding() {
  return (
    <div style={{ height: 560, width: 720 }}>
      <TooltipProvider>
        <SinglePaneStepperV2.Root
          flow={flow}
          contentTitle="Create your first pipeline"
          contentSubtitle="Answer each question. Completed answers stay in the thread."
          showRootHeader={false}
        />
      </TooltipProvider>
    </div>
  )
}

export function HideInactive() {
  return (
    <div style={{ height: 560, width: 720 }}>
      <TooltipProvider>
        <SinglePaneStepperV2.Root
          flow={flow}
          contentTitle="Create your first pipeline"
          showRootHeader={false}
          showInactiveSteps={false}
        />
      </TooltipProvider>
    </div>
  )
}
