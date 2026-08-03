// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-19411
// source=packages/ui/src/components/button-layout.tsx
// component=ButtonLayout

import figma from 'figma'

const instance = figma.selectedInstance

const orientation = instance.getEnum('orientation', {
  horizontal: 'horizontal',
  vertical: 'vertical'
})

const horizontalAlign = instance.getEnum('position', {
  start: 'start',
  end: 'end'
})

const hasPrimary = instance.getBoolean('Primary#28712:0')
const hasSecondary = instance.getBoolean('Secondary#28712:4')

export default {
  example: figma.code`
    <ButtonLayout.Root orientation="${orientation}" horizontalAlign="${horizontalAlign}">
      ${hasSecondary ? figma.code`<ButtonLayout.Secondary><Button variant="secondary">Button text</Button></ButtonLayout.Secondary>` : ''}
      ${hasPrimary ? figma.code`<ButtonLayout.Primary><Button variant="primary">Button text</Button></ButtonLayout.Primary>` : ''}
    </ButtonLayout.Root>
  `,
  imports: [
    'import { ButtonLayout } from "@harnessio/ui/components"',
    'import { Button } from "@harnessio/ui/components"'
  ],
  id: 'button-layout',
  metadata: {
    nestable: true
  }
}
