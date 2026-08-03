// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=17386-13057
// source=packages/ui/src/components/tag.tsx
// component=Tag

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('text#17386:0')
const value = instance.getString('section text#17386:1')

const theme = instance.getEnum('theme', {
  '⚫ gray': 'gray',
  '🔴 red': 'red',
  '🔵 blue': 'blue',
  '🔵 cyan': 'cyan',
  '🔵 indigo': 'indigo',
  '🟠 orange': 'orange',
  '🟡 yellow': 'yellow',
  '🟢 green': 'green',
  '🟢 mint': 'mint',
  '🟣 pink': 'pink',
  '🟣 purple': 'purple',
  '🟣 violet': 'violet',
  '🟤 brown': 'brown'
})

const size = instance.getEnum('size', {
  md: 'md',
  sm: 'sm'
})

const hasIcon = instance.getBoolean('icon#17386:3')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#17386:4') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`
    <Tag
      size="${size}"
      theme="${theme}"
      label="${label}"
      value="${value}"
      ${iconCode ? figma.code`icon={${iconCode}}` : ''}
    />
  `,
  imports: ['import { Tag } from "@harnessio/ui/components"'],
  id: 'tag-split',
  metadata: {
    nestable: true
  }
}
