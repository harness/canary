// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11824-115977
// source=packages/ui/src/components/skeletons/skeleton-typography.tsx
// component=Skeleton.Typography

import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  'heading: hero': 'heading-hero',
  'heading: section': 'heading-section',
  'heading: subsection': 'heading-subsection',
  'heading: base': 'heading-base',
  'heading: small': 'heading-small',
  body: 'body-normal',
  'body: code': 'body-code',
  'body: single-line': 'body-single-line-normal',
  'body: single-line: code': 'body-code',
  caption: 'caption-normal',
  'caption: single-line': 'caption-single-line'
})

export default {
  example: figma.code`<Skeleton.Typography variant="${variant}" />`,
  imports: ['import { Skeleton } from "@harnessio/ui/components"'],
  id: 'skeleton-typography',
  metadata: {
    nestable: true
  }
}
