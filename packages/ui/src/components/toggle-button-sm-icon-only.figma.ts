// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-20857
// source=packages/ui/src/components/toggle.tsx
// component=Toggle

import figma from 'figma'

function extractIconName(executed) {
  if (!executed) return null
  const sections = executed.example
  for (const section of sections) {
    if (section.type === 'CODE') {
      const match = section.code.match(/name="([^"]+)"/)
      if (match) return match[1]
    }
  }
  return null
}

const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  outline: 'outline',
  ghost: 'ghost',
  transparent: 'transparent'
})

const selectedVariant = instance.getEnum('selected-variant', {
  primary: 'primary',
  secondary: 'secondary'
})

const disabled = instance.getEnum('👁️ disabled', {
  off: false,
  on: true
})

const selected = instance.getEnum('selected', {
  off: false,
  on: true
})

const icon = instance.getInstanceSwap('↳ icon#7790:2')
const prefixIcon = icon && icon.type === 'INSTANCE' ? extractIconName(icon.executeTemplate()) : null

const selectedIconInstance = selected ? instance.getInstanceSwap('↳ selected icon#9477:66') : null
const selectedIcon =
  selectedIconInstance && selectedIconInstance.type === 'INSTANCE'
    ? extractIconName(selectedIconInstance.executeTemplate())
    : null

const activePrefixIcon = selected ? (selectedIcon ?? prefixIcon) : prefixIcon

const hasTooltip = instance.getBoolean('tooltip#7883:0')
const tooltipContent = hasTooltip ? instance.getString('tooltip text#5971:0') : null
const hasTitle = hasTooltip ? instance.getBoolean('title#7308:9') : false
const tooltipTitle = hasTitle ? instance.getString('title text#7308:7') : null

export default {
  example: figma.code`
    <Toggle
      variant="${variant}"
      selectedVariant="${selectedVariant}"
      size="sm"
      iconOnly
      prefixIcon="${activePrefixIcon}"
      ${disabled ? 'disabled' : ''}
      ${selected ? 'selected' : ''}
      ${
        hasTooltip
          ? figma.code`tooltipProps={{ content: "${tooltipContent}"${tooltipTitle ? figma.code`, title: "${tooltipTitle}"` : ''} }}`
          : ''
      }
    />
  `,
  imports: ['import { Toggle } from "@harnessio/ui/components"'],
  id: 'toggle-button-sm-icon-only',
  metadata: {
    nestable: true
  }
}
