// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6102-83627
// source=packages/ui/src/components/card.tsx
// component=Card

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg'
})

const selected = instance.getEnum('state', {
  default: false,
  hover: false,
  selected: true,
  disabled: false
})

const disabled = instance.getEnum('state', {
  default: false,
  hover: false,
  selected: false,
  disabled: true
})

export default {
  example: figma.code`
    <Card.Root
      size="${size}"
      ${selected ? 'selected' : ''}
      ${disabled ? 'disabled' : ''}
    >
      <Card.Content>Card content</Card.Content>
    </Card.Root>
  `,
  imports: ['import { Card } from "@harnessio/ui/components"'],
  id: 'card-default',
  metadata: {
    nestable: true
  }
}
