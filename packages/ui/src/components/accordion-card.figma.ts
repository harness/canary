// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=13197-152529
// source=packages/ui/src/components/accordion/accordion.tsx
// component=Accordion

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', { sm: 'sm', md: 'md' })

const hasCard3 = instance.getBoolean('card-03#14437:0')
const hasCard4 = instance.getBoolean('card-04#14437:3')
const hasCard5 = instance.getBoolean('card-05#14437:6')

const cardCount = 2 + [hasCard3, hasCard4, hasCard5].filter(Boolean).length

const items = Array.from({ length: cardCount }, (_, i) => i + 1)
  .map(
    i => `
      <Accordion.Item value="item-${i}">
        <Accordion.Trigger>Accordion item ${i}</Accordion.Trigger>
        <Accordion.Content>Accordion content ${i}</Accordion.Content>
      </Accordion.Item>`
  )
  .join('')

export default {
  example: figma.code`
    <Accordion.Root type="single" variant="card" cardSize="${size}">${items}
    </Accordion.Root>
  `,
  imports: ['import { Accordion } from "@harnessio/ui/components"'],
  id: 'accordion-card',
  metadata: {
    nestable: true
  }
}
