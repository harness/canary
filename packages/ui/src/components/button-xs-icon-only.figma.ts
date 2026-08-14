// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-17625
// source=packages/ui/src/components/button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  transparent: 'transparent',
  ghost: 'ghost',
  outline: 'outline',
  secondary: 'secondary',
  primary: 'primary',
  ai: 'ai'
})

const theme = instance.getEnum('theme', {
  '⚫ default': 'default',
  '🟢 success': 'success',
  '🔴 danger': 'danger'
})

const disabled = instance.getEnum('👁️ disabled', {
  off: false,
  on: true
})

const loading = instance.getEnum('state', {
  default: false,
  hover: false,
  active: false,
  loading: true
})

const icon = instance.getInstanceSwap('↳ icon')
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

const hasTooltip = instance.getBoolean('tooltip')
const tooltipContent = hasTooltip ? '...' : null

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      size="xs"
      theme="${theme}"
      iconOnly
      ${disabled ? 'disabled' : ''}
      ${loading ? 'loading' : ''}
      ${hasTooltip ? figma.code`tooltipProps={{ content: "${tooltipContent}" }}` : 'ignoreIconOnlyTooltip'}
    >
      ${iconCode ? figma.code`${iconCode}` : ''}
    </Button>
  `,
  imports: ['import { Button } from "@harnessio/ui/components"'],
  id: 'button-xs-icon-only',
  metadata: {
    nestable: true
  }
}
