// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=4327-88188
// source=packages/ui/src/components/alert/index.ts
// component=Alert

import figma from 'figma'

const instance = figma.selectedInstance

const theme = instance.getEnum('variant', {
  'ℹ️ info': 'info',
  '🛑 danger': 'danger',
  '⚠️ warning': 'warning',
  '✅ success': 'success'
})

const truncate = instance.getEnum('truncate', {
  none: false,
  '⬇️ show more': true,
  '⬆️ show less': true
})

const hasTitle = instance.getBoolean('title#5210:40')
const titleText = hasTitle ? instance.getString('title text#26:5') : null

const descriptionText = instance.getString('description text#26:4')

// Figma exposes a `custom-content` boolean + `swap to your content:` INSTANCE_SWAP
// for freeform content, but Alert.Description only accepts text/Alert.Link children
// in code — omitted rather than invented.
const hasLink = instance.getBoolean('link#5210:36')
const link = hasLink ? instance.findInstance('❖Link') : null
let linkCode
if (link && link.type === 'INSTANCE') {
  linkCode = link.executeTemplate().example
}

export default {
  example: figma.code`
    <Alert.Root
      theme="${theme}"
      ${truncate ? 'expandable' : ''}
    >
      ${hasTitle ? figma.code`<Alert.Title>${titleText}</Alert.Title>` : ''}
      <Alert.Description>
        ${descriptionText}
        ${linkCode ? figma.code`${linkCode}` : ''}
      </Alert.Description>
    </Alert.Root>
  `,
  imports: ['import { Alert } from "@harnessio/ui/components"'],
  id: 'alert',
  metadata: {
    nestable: true
  }
}
