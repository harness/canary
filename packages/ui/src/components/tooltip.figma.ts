// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=5971-12551
// source=packages/ui/src/components/tooltip.tsx
// component=Tooltip

import figma from 'figma'

const instance = figma.selectedInstance

const theme = instance.getEnum('theme', {
  default: 'default',
  themed: 'themed'
})

const [side, align] = instance.getEnum('tip position', {
  none: ['top', 'center'],
  '⬆️ top left': ['top', 'start'],
  '⬆️ top center': ['top', 'center'],
  '⬆️ top right': ['top', 'end'],
  '➡️ right top': ['right', 'start'],
  '➡️ right center': ['right', 'center'],
  '➡️ right bottom': ['right', 'end'],
  '⬇️ bottom left': ['bottom', 'start'],
  '⬇️ bottom center': ['bottom', 'center'],
  '⬇️ bottom right': ['bottom', 'end'],
  '⬅️ left top': ['left', 'start'],
  '⬅️ left center': ['left', 'center'],
  '⬅️ left bottom': ['left', 'end']
}) ?? ['top', 'center']

const hideArrow = instance.getEnum('tip position', {
  none: true,
  '⬆️ top left': false,
  '⬆️ top center': false,
  '⬆️ top right': false,
  '➡️ right top': false,
  '➡️ right center': false,
  '➡️ right bottom': false,
  '⬇️ bottom left': false,
  '⬇️ bottom center': false,
  '⬇️ bottom right': false,
  '⬅️ left top': false,
  '⬅️ left center': false,
  '⬅️ left bottom': false
})

const hasTitle = instance.getBoolean('title#7308:9')
const title = hasTitle ? instance.getString('title text#7308:7') : null

const hasCustomContent = instance.getBoolean('custom content#14253:2')
const text = instance.getString('tooltip text#5971:0')

export default {
  example: figma.code`
    <Tooltip
      ${hasCustomContent ? figma.code`content={${instance.getInstanceSwap('container: swap it with your content#14253:3')}}` : figma.code`content="${text}"`}
      side="${side}"
      align="${align}"
      ${hideArrow ? 'hideArrow' : ''}
      ${theme !== 'default' ? figma.code`theme="${theme}"` : ''}
      ${title ? figma.code`title="${title}"` : ''}
    >
      <button>Hover me</button>
    </Tooltip>
  `,
  imports: ['import { Tooltip } from "@harnessio/ui/components"'],
  id: 'tooltip',
  metadata: {
    nestable: true
  }
}
