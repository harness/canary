// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1444-10547
// source=packages/ui/src/components/tag.tsx
// component=Tag

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('text#1444:4')

const variant = instance.getEnum('variant', {
  outline: 'outline',
  secondary: 'secondary'
})

const theme = instance.getEnum('theme', {
  '⚫ gray': 'gray',
  '🔵 blue': 'blue',
  '🟤 brown': 'brown',
  '🔵 cyan': 'cyan',
  '🟢 green': 'green',
  '🔵 indigo': 'indigo',
  '🟣 violet': 'violet',
  '🟠 orange': 'orange',
  '🟢 mint': 'mint',
  '🟣 pink': 'pink',
  '🔴 red': 'red',
  '🟣 purple': 'purple',
  '🟡 yellow': 'yellow'
})

const size = instance.getEnum('size', {
  md: 'md',
  sm: 'sm'
})

const hasIcon = instance.getBoolean('icon#1444:5')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#1444:6') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`
    <Tag
      variant="${variant}"
      size="${size}"
      theme="${theme}"
      value="${label}"
      ${iconCode ? figma.code`icon={${iconCode}}` : ''}
    />
  `,
  imports: ['import { Tag } from "@harnessio/ui/components"'],
  id: 'tag',
  metadata: {
    nestable: true
  }
}
