// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6117-41270
// source=packages/ui/src/components/card.tsx
// component=Card

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg'
})

const orientation = instance.getEnum('orientation', {
  vertical: 'vertical',
  horizontal: 'horizontal'
})

const position = instance.getEnum('position', {
  start: 'start',
  end: 'end'
})

export default {
  example: figma.code`
    <Card.Root
      size="${size}"
      orientation="${orientation}"
      position="${position}"
    >
      <Card.Image src="https://placehold.co/400x300" alt="" />
      <Card.Content>Card content</Card.Content>
    </Card.Root>
  `,
  imports: ['import { Card } from "@harnessio/ui/components"'],
  id: 'card-image',
  metadata: {
    nestable: true
  }
}
