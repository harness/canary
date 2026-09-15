// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11833-116001
// source=packages/ui/src/components/skeletons/skeleton-avatar.tsx
// component=Skeleton.Avatar

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })
const rounded = instance.getBoolean('rounded')

export default {
  example: figma.code`<Skeleton.Avatar size="${size}"${rounded ? ' rounded' : ''} />`,
  imports: ['import { Skeleton } from "@harnessio/ui/components"'],
  id: 'skeleton-avatar',
  metadata: {
    nestable: true
  }
}
