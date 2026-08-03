// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=13197-152576
// source=packages/ui/src/components/accordion/accordion.tsx
// component=Accordion

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', { md: 'md', sm: 'sm' })

const hasItem3 = instance.getBoolean('item-03#14437:18')
const hasItem4 = instance.getBoolean('item-04#14437:21')
const hasItem5 = instance.getBoolean('item-05#14437:24')
const hasItem6 = instance.getBoolean('item-06#14437:27')
const hasItem7 = instance.getBoolean('item-07#14437:30')
const hasItem8 = instance.getBoolean('item-08#14437:33')

const itemCount = 2 + [hasItem3, hasItem4, hasItem5, hasItem6, hasItem7, hasItem8].filter(Boolean).length

const items = Array.from({ length: itemCount }, (_, i) => i + 1)
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
    <Accordion.Root type="single" size="${size}">${items}
    </Accordion.Root>
  `,
  imports: ['import { Accordion } from "@harnessio/ui/components"'],
  id: 'accordion-default',
  metadata: {
    nestable: true
  }
}
