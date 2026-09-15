// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=20356-881
// source=packages/ui/src/components/gauge.tsx
// component=Gauge

import figma from 'figma'

const instance = figma.selectedInstance

const hasLabel = instance.getBoolean('label#20301:0')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const value = instance.getEnum('range', {
  '⚪ 0': 0,
  '🔴 15': 15,
  '🔴 35': 35,
  '🔴 55': 55,
  '🟡 65': 65,
  '🟡 75': 75,
  '🟢 85': 85,
  '🟢 95': 95,
  '🟢 100': 100
})

const status = instance.getEnum('status', {
  '🚥 auto': 'auto',
  '🔵 none': 'none'
})

const valueFormat = instance.getEnum('format', {
  '✂️ percent': 'percent',
  '⚖️ fraction': 'fraction'
})

export default {
  example: figma.code`
    <Gauge
      size="md"
      value={${value}}
      status="${status}"
      valueFormat="${valueFormat}"
      ${label ? figma.code`label="${label}"` : ''}
    />
  `,
  imports: ['import { Gauge } from "@harnessio/ui/components"'],
  id: 'gauge-radial-md',
  metadata: {
    nestable: true
  }
}
