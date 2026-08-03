// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1782-29559
// source=packages/ui/src/components/counter-badge.tsx
// component=CounterBadge

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('number-value#7030:133')

const variant = instance.getEnum('variant', {
  secondary: 'secondary',
  outline: 'outline'
})

const theme = instance.getEnum('theme', {
  '⚫ default': 'default',
  '🔵 info': 'info',
  '🔴 danger': 'danger',
  '🟢 success': 'success'
})

export default {
  example: figma.code`
    <CounterBadge
      variant="${variant}"
      theme="${theme}"
    >
      ${label}
    </CounterBadge>
  `,
  imports: ['import { CounterBadge } from "@harnessio/ui/components"'],
  id: 'counter-badge',
  metadata: {
    nestable: true
  }
}
