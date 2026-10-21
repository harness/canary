// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1293-5995
// source=packages/ui/src/components/status-badge/status-badge.tsx
// component=StatusBadge

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('textString#1299:25')

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

// StatusBadge takes `icon` as an icon *name* (keyof IconNameMapV2) and renders
// <IconV2 name={icon} /> internally — unlike Button, which has no icon prop and
// takes icons as children. So the swapped instance's template is used only to
// recover that name, not emitted as JSX.
//
// NOTE: the icon component set has no Code Connect mapping of its own, so
// executeTemplate() currently yields nothing and the prop is omitted. This
// resolves on its own once the icon component is connected; until then an icon
// drawn in Figma will not appear in the generated snippet.
const hasIcon = variant !== 'status' && instance.getBoolean('viewIcon#1293:13')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#1299:52') : null
let iconName
if (icon && icon.type === 'INSTANCE') {
  const iconExample = icon.executeTemplate().example
  const iconNameMatch = iconExample ? /name="([^"]+)"/.exec(iconExample) : null
  iconName = iconNameMatch ? iconNameMatch[1] : undefined
}

export default {
  example: figma.code`
    <StatusBadge
      variant="${variant}"
      size="${size}"
      theme="${theme}"
      ${iconName ? figma.code`icon="${iconName}"` : ''}
    >
      ${label}
    </StatusBadge>
  `,
  imports: ['import { StatusBadge } from "@harnessio/ui/components"'],
  id: 'status-badge',
  metadata: {
    nestable: true
  }
}
