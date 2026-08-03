// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=873-49532
// source=packages/ui/src/components/avatar.tsx
// component=Avatar

import figma from 'figma'

const instance = figma.selectedInstance

const name = instance.getString('text#874:34')

const size = instance.getEnum('size', {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg'
})

const rounded = instance.getEnum('rounded', {
  on: true,
  off: false
})

const variant = instance.getEnum('variant', {
  text: 'text',
  img: 'img',
  gradient: 'gradient',
  icon: 'icon'
})

export default {
  example: figma.code`
    <Avatar
      ${variant === 'text' ? figma.code`name="${name}"` : ''}
      size="${size}"
      rounded={${rounded}}
    />
  `,
  imports: ['import { Avatar } from "@harnessio/ui/components"'],
  id: 'avatar',
  metadata: {
    nestable: true
  }
}
