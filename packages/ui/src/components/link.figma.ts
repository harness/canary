// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1006-424439
// source=packages/ui/src/components/link.tsx
// component=Link

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('text#1006:0')

const variant = instance.getEnum('variant', {
  default: 'default',
  secondary: 'secondary'
})

const size = instance.getEnum('size', {
  md: 'md',
  sm: 'sm'
})

const state = instance.getEnum('state', {
  default: 'default',
  hover: 'hover',
  disabled: 'disabled'
})

const disabled = state === 'disabled'

const hasSuffixIcon = instance.getBoolean('suffix-icon#1006:1')
const hasPrefixIcon = instance.getBoolean('prefix-icon#5483:17')

export default {
  example: figma.code`
    <Link
      variant="${variant}"
      size="${size}"
      ${disabled ? 'disabled' : ''}
      ${hasPrefixIcon ? 'prefixIcon' : ''}
      ${hasSuffixIcon ? 'suffixIcon' : ''}
    >
      ${label}
    </Link>
  `,
  imports: ['import { Link } from "@harnessio/ui/components"'],
  id: 'link',
  metadata: {
    nestable: true
  }
}
