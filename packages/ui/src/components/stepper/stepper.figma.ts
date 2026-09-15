// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=26362-10193
// source=packages/ui/src/components/stepper/stepper.tsx
// component=Stepper

import figma from 'figma'

// The individual step instances (.StepVert, .StepHor, .StepBarHor) are dot-prefixed internal
// helper components in Figma and can't be published/mapped via Code Connect, so their per-step
// title/description/state content can't be resolved dynamically here. This shows a
// representative, illustrative example — Stepper.Step count and content are set by the consumer.
export default {
  example: figma.code`
    <Stepper.Root value="step-1" onValueChange={(value) => {}}>
      <Stepper.Step value="step-1" title="Step one" />
      <Stepper.Step value="step-2" title="Step two" />
      <Stepper.Step value="step-3" title="Step three" />
    </Stepper.Root>
  `,
  imports: ['import { Stepper } from "@harnessio/ui/components"'],
  id: 'stepper',
  metadata: {
    nestable: false
  }
}
