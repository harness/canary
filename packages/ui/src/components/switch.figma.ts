// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=741-33694
// source=packages/ui/src/components/switch.tsx
// component=Switch

import figma from 'figma'

const instance = figma.selectedInstance

const selected = instance.getEnum('selected', {
  off: false,
  on: true
})

const disabled = instance.getEnum('disabled', {
  off: false,
  on: true
})

const switchOnly = instance.getEnum('switch only', {
  on: true,
  off: false
})

const showDescription = instance.getBoolean('show description#428:18')
const description = instance.getString('description text#428:13')

const label = switchOnly ? null : instance.findText('text', { traverseInstances: true }).textContent

export default {
  example: figma.code`
    <Switch
      checked={${selected}}
      disabled={${disabled}}
      ${label ? figma.code`label="${label}"` : ''}
      ${showDescription ? figma.code`caption="${description}"` : ''}
    />
  `,
  imports: ['import { Switch } from "@harnessio/ui/components"'],
  id: 'switch',
  metadata: {
    nestable: true
  }
}
