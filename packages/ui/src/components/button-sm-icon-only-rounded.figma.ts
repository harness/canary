// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-17482
// source=packages/ui/src/components/button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
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

const icon = instance.getInstanceSwap('↳ icon#7790:7')
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

const hasTooltip = instance.getBoolean('tooltip#7883:133')
const tooltipContent = hasTooltip ? instance.getString('tooltip text#5971:0') : null
const hasTitle = hasTooltip ? instance.getBoolean('title#7308:9') : false
const tooltipTitle = hasTitle ? instance.getString('title text#7308:7') : null

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      size="sm"
      rounded
      iconOnly
      ${theme ? figma.code`theme="${theme}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${loading ? 'loading' : ''}
      ${
        hasTooltip
          ? figma.code`tooltipProps={{ content: "${tooltipContent}"${tooltipTitle ? figma.code`, title: "${tooltipTitle}"` : ''} }}`
          : 'ignoreIconOnlyTooltip'
      }
    >
      ${iconCode ? figma.code`${iconCode}` : ''}
    </Button>
  `,
  imports: ['import { Button } from "@harnessio/ui/components"'],
  id: 'button-sm-icon-only-rounded',
  metadata: {
    nestable: true
  }
}
