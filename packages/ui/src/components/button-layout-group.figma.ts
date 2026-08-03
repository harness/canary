// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-19420
// source=packages/ui/src/components/button-layout.tsx
// component=ButtonLayout

import figma from 'figma'

const instance = figma.selectedInstance

const horizontalAlign = instance.getEnum('position', {
  start: 'start',
  end: 'end'
})

const has3 = instance.getBoolean('3-action#7586:3')
const has2 = instance.getBoolean('2-action#7586:4')
const has1 = instance.getBoolean('1-action#7586:5')

const actionCount = has3 ? 3 : has2 ? 2 : has1 ? 1 : 0
const actions = Array.from({ length: actionCount })

export default {
  example: figma.code`
    <ButtonLayout.Root horizontalAlign="${horizontalAlign}">
      ${actions.map(
        () =>
          figma.code`<Button variant="ghost" size="sm" iconOnly prefixIcon="plus" tooltipProps={{ content: "..." }} />`
      )}
    </ButtonLayout.Root>
  `,
  imports: [
    'import { ButtonLayout } from "@harnessio/ui/components"',
    'import { Button } from "@harnessio/ui/components"'
  ],
  id: 'button-layout-group',
  metadata: {
    nestable: true
  }
}
