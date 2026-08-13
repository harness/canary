// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-16479
// source=packages/ui/src/components/button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('button text#1548:83')

const variant = instance.getEnum('variant', {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  transparent: 'transparent',
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

const hasIcon = instance.getBoolean('icon#1548:81')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#1548:82') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

const hasSuffixIcon = instance.getBoolean('suffix icon#1687:92')
const suffixIcon = hasSuffixIcon ? instance.getInstanceSwap('↳ suffix#7222:0') : null
let suffixIconCode
if (suffixIcon && suffixIcon.type === 'INSTANCE') {
  suffixIconCode = suffixIcon.executeTemplate().example
}

export default {
  example: figma.code`
    <Button
      variant="${variant}"
      size="xs"
      ${theme ? figma.code`theme="${theme}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${loading ? 'loading' : ''}
    >
      ${iconCode ? figma.code`${iconCode}` : ''}
      ${label}
      ${suffixIconCode ? figma.code`${suffixIconCode}` : ''}
    </Button>
  `,
  imports: ['import { Button } from "@harnessio/ui/components"'],
  id: 'button-xs-text',
  metadata: {
    nestable: true
  }
}
