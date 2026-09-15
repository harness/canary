// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=10568-32440
// source=packages/ui/src/components/inputs/text-input.tsx
// component=TextInput

import figma from 'figma'

const instance = figma.selectedInstance

const hasCaption = instance.getBoolean('caption#14478:16')
const caption = hasCaption
  ? instance.findText('description', { traverseInstances: true, path: ['❖Description'] }).textContent
  : null

const disabled = instance.getEnum('👁️ disabled', {
  off: false,
  on: true
})

const readOnly = instance.getEnum('read-only', {
  off: false,
  on: true
})

const error = instance.getEnum('error', {
  off: false,
  on: true
})

export default {
  example: figma.code`
    <TextInput
      type="password"
      orientation="horizontal"
      label="Password"
      ${caption ? figma.code`caption="${caption}"` : ''}
      theme="${error ? 'danger' : 'default'}"
      disabled={${disabled}}
      readOnly={${readOnly}}
      placeholder="Placeholder text"
    />
  `,
  imports: ['import { TextInput } from "@harnessio/ui/components"'],
  id: 'password-input-horizontal',
  metadata: {
    nestable: true
  }
}
