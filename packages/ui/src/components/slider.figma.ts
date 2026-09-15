// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=22779-189768
// source=packages/ui/src/components/slider.tsx
// component=Slider

import figma from 'figma'

const instance = figma.selectedInstance

const isRange = instance.getEnum('slider-type', {
  '➡️ single': false,
  '↔️ range': true
})

const disabled = instance.getEnum('👁️ disabled', {
  off: false,
  on: true
})

const caption = instance.getEnum('caption', {
  '🔢 min-max': 'min-max',
  '💬 description': 'description'
})

const hasLabel = instance.getBoolean('💠 label#22779:348')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const hasDescription = instance.getBoolean('💬 description#22783:22')
const description = hasDescription
  ? instance.findText('description', { traverseInstances: true, path: ['❖Description'] }).textContent
  : null

// `.SliderThumb` and `.SliderValueIndicator` are dot-prefixed internal helpers hidden from the
// Assets panel and can't be Code-Connect-mapped individually — their hover value tooltip is
// rendered by `Slider` itself and isn't set via props.

export default {
  example: figma.code`
    <Slider
      ${isRange ? 'defaultValue={[20, 80]}' : 'defaultValue={[50]}'}
      ${disabled ? 'disabled' : ''}
      ${caption ? figma.code`caption="${caption}"` : ''}
      ${label ? figma.code`label="${label}"` : ''}
      ${description ? figma.code`description="${description}"` : ''}
    />
  `,
  imports: ['import { Slider } from "@harnessio/ui/components"'],
  id: 'slider',
  metadata: {
    nestable: true
  }
}
