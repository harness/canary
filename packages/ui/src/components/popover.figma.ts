// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=14302-49961
// source=packages/ui/src/components/popover.tsx
// component=Popover

import figma from 'figma'

const instance = figma.selectedInstance

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

const hasTitle = instance.getBoolean('title#14302:3')
const title = hasTitle ? instance.getString('title text#14302:2') : null

const hasDescription = instance.getBoolean('description#14302:7')
const description = hasDescription ? instance.getString('description text#14302:0') : null

const hasLink = instance.getBoolean('link#14302:4')
const linkText = hasLink ? instance.findText('text', { traverseInstances: true, path: ['❖Link'] }).textContent : null

const hasCustomContent = instance.getBoolean('custom content#14302:5')

export default {
  example: figma.code`
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>Open</button>
      </Popover.Trigger>
      <Popover.Content
        side="${side}"
        align="${align}"
        ${hasCustomContent ? 'custom' : ''}
        ${title ? figma.code`title="${title}"` : ''}
        ${description ? figma.code`description="${description}"` : ''}
        ${linkText ? figma.code`linkProps={{ text: "${linkText}", href: "#" }}` : ''}
      >
        ${hasCustomContent ? figma.code`${instance.getInstanceSwap('container: swap it with your content#14302:6')}` : ''}
      </Popover.Content>
    </Popover.Root>
  `,
  imports: ['import { Popover } from "@harnessio/ui/components"'],
  id: 'popover',
  metadata: {
    nestable: true
  }
}
