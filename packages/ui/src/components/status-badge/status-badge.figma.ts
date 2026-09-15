// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1293-5995
// source=packages/ui/src/components/status-badge/status-badge.tsx
// component=StatusBadge

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('text#1299:25')

const variant = instance.getEnum('variant', {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  status: 'status'
})

const size = instance.getEnum('size', {
  md: 'md',
  sm: 'sm'
})

const theme = instance.getEnum('theme', {
  '⚫ muted': 'muted',
  '🟢 success': 'success',
  '🔴 danger': 'danger',
  '🟡 warning': 'warning',
  '🔵 info': 'info',
  '🟣 merged': 'merged',
  '🟠 risk': 'risk'
})

const hasIcon = variant !== 'status' && instance.getBoolean('icon#1293:13')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#1299:52') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`
    <StatusBadge
      variant="${variant}"
      size="${size}"
      theme="${theme}"
    >
      ${iconCode ? figma.code`${iconCode}` : ''}
      ${label}
    </StatusBadge>
  `,
  imports: ['import { StatusBadge } from "@harnessio/ui/components"'],
  id: 'status-badge',
  metadata: {
    nestable: true
  }
}
