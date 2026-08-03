// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-20145
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

const label = instance.getString('button text#37:10')

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

const hasIcon = instance.getBoolean('icon#37:11')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#46:0') : null
const prefixIcon = icon && icon.type === 'INSTANCE' ? extractIconName(icon.executeTemplate()) : null

const hasSuffixIcon = instance.getBoolean('suffix icon#1687:0')
const suffixIconInstance = hasSuffixIcon ? instance.getInstanceSwap('↳ suffix#1955:0') : null
const suffixIcon =
  suffixIconInstance && suffixIconInstance.type === 'INSTANCE'
    ? extractIconName(suffixIconInstance.executeTemplate())
    : null

const selectedIconInstance = selected ? instance.getInstanceSwap('↳ selected icon#9477:132') : null
const selectedIcon =
  selectedIconInstance && selectedIconInstance.type === 'INSTANCE'
    ? extractIconName(selectedIconInstance.executeTemplate())
    : null

const selectedSuffixIconInstance = selected ? instance.getInstanceSwap('↳ selected suffix icon#9622:0') : null
const selectedSuffixIcon =
  selectedSuffixIconInstance && selectedSuffixIconInstance.type === 'INSTANCE'
    ? extractIconName(selectedSuffixIconInstance.executeTemplate())
    : null

const activePrefixIcon = selected ? (selectedIcon ?? prefixIcon) : prefixIcon
const activeSuffixIcon = selected ? (selectedSuffixIcon ?? suffixIcon) : suffixIcon

export default {
  example: figma.code`
    <Toggle
      variant="${variant}"
      selectedVariant="${selectedVariant}"
      size="xs"
      ${disabled ? 'disabled' : ''}
      ${selected ? 'selected' : ''}
      ${activePrefixIcon ? figma.code`prefixIcon="${activePrefixIcon}"` : ''}
      ${activeSuffixIcon ? figma.code`suffixIcon="${activeSuffixIcon}"` : ''}
      text="${label}"
    />
  `,
  imports: ['import { Toggle } from "@harnessio/ui/components"'],
  id: 'toggle-button-xs-text',
  metadata: {
    nestable: true
  }
}
