// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-19311
// source=packages/ui/src/components/button-group.tsx
// component=ButtonGroup

import figma from 'figma'

const instance = figma.selectedInstance

const orientation = instance.getEnum('orientation', {
  vertical: 'vertical',
  horizontal: 'horizontal'
})

const iconOnly = instance.getEnum('icon only', {
  off: false,
  on: true
})

// ButtonGroup takes a buttonsProps array of prop objects rather than JSX
// children, so nested Button instances can't be rendered dynamically here.
// This is an illustrative example, not a generated one.
export default {
  example: figma.code`
    <ButtonGroup
      orientation="${orientation}"
      ${iconOnly ? 'iconOnly' : ''}
      buttonsProps={[
        { children: 'Button' },
        { children: 'Button' }
      ]}
    />
  `,
  imports: ['import { ButtonGroup } from "@harnessio/ui/components"'],
  id: 'button-group',
  metadata: {
    nestable: false
  }
}
