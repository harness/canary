// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=22801-367
// source=packages/ui/src/components/slider.tsx
// component=SeveritySlider

import figma from 'figma'

const instance = figma.selectedInstance

const hasLabel = instance.getBoolean('💠 label#22805:0')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

// `.SliderThumb` and `.SliderValueIndicator` are dot-prefixed internal helpers hidden from the
// Assets panel and can't be Code-Connect-mapped individually.

export default {
  example: figma.code`
    <SeveritySlider
      defaultValue={[20, 70]}
      ${label ? figma.code`label="${label}"` : ''}
    />
  `,
  imports: ['import { SeveritySlider } from "@harnessio/ui/components"'],
  id: 'slider-severity',
  metadata: {
    nestable: true
  }
}
