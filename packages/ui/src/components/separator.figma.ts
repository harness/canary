// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1835-115285
// source=packages/ui/src/components/separator.tsx
// component=Separator

import figma from 'figma'

const instance = figma.selectedInstance

const orientation = instance.getEnum('orientation', {
  horizontal: 'horizontal',
  vertical: 'vertical'
})

export default {
  example: figma.code`
    <Separator orientation="${orientation}" />
  `,
  imports: ['import { Separator } from "@harnessio/ui/components"'],
  id: 'separator',
  metadata: {
    nestable: true
  }
}
