// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=10578-119045
// source=packages/ui/src/components/form-primitives/textarea.tsx
// component=Textarea

import figma from 'figma'

const instance = figma.selectedInstance

const hasLabel = instance.getBoolean('label#183:11')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const hasDescription = instance.getBoolean('description#183:16')
const caption = hasDescription
  ? instance.findText('description', { traverseInstances: true, path: ['❖Description'] }).textContent
  : null

const resizable = instance.getBoolean('resizable#1995:22')

const state = instance.getEnum('state', {
  default: 'default',
  hover: 'default',
  selected: 'default',
  error: 'danger',
  'read-only': 'default',
  disabled: 'default'
})

const disabled = instance.getEnum('state', {
  default: false,
  hover: false,
  selected: false,
  error: false,
  'read-only': false,
  disabled: true
})

const readOnly = instance.getEnum('state', {
  default: false,
  hover: false,
  selected: false,
  error: false,
  'read-only': true,
  disabled: false
})

export default {
  example: figma.code`
    <Textarea
      orientation="horizontal"
      ${label ? figma.code`label="${label}"` : ''}
      ${caption ? figma.code`caption="${caption}"` : ''}
      theme="${state}"
      disabled={${disabled}}
      readOnly={${readOnly}}
      resizable={${resizable}}
      placeholder="Placeholder text"
    />
  `,
  imports: ['import { Textarea } from "@harnessio/ui/components"'],
  id: 'textarea-horizontal',
  metadata: {
    nestable: true
  }
}
