// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6988-134363
// source=packages/ui/src/components/progress.tsx
// component=Progress

import figma from 'figma'

const instance = figma.selectedInstance

const percent = instance.getEnum('%', {
  '100%': 1,
  '75%': 0.75,
  '50%': 0.5,
  '25%': 0.25,
  '0%': 0,
  '–': undefined
})

const state = instance.getEnum('state', {
  '🔄 processing': 'processing',
  '✅ completed': 'completed',
  '❌ failed': 'failed',
  '⏸️ paused': 'paused',
  '0️⃣ indeterminate': undefined
})

const isIndeterminate = instance.getEnum('state', {
  '🔄 processing': false,
  '✅ completed': false,
  '❌ failed': false,
  '⏸️ paused': false,
  '0️⃣ indeterminate': true
})

const hasLabel = instance.getBoolean('label#6988:30')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const showPercentage = instance.getBoolean('show percentage#6958:32')
const showStatus = instance.getBoolean('show status#7006:117')

const hasDescription = instance.getBoolean('description#6981:12')
const descriptionText = hasDescription ? instance.getString('↳ description text#6981:0') : null
const errorText = state === 'failed' ? instance.getString('↳ error text#6988:41') : null
const description = errorText ?? descriptionText

const subtitle = showStatus && state === 'processing' ? instance.getString('time-left#6988:60') : null

export default {
  example: figma.code`
    <Progress
      size="lg"
      ${isIndeterminate ? 'variant="indeterminate"' : figma.code`value={${percent}}`}
      ${!isIndeterminate && state ? figma.code`state="${state}"` : ''}
      ${!showPercentage ? 'hidePercentage' : ''}
      ${!showStatus ? 'hideIcon' : ''}
      ${label ? figma.code`label="${label}"` : ''}
      ${description ? figma.code`description="${description}"` : ''}
      ${subtitle ? figma.code`subtitle="${subtitle}"` : ''}
    />
  `,
  imports: ['import { Progress } from "@harnessio/ui/components"'],
  id: 'progress-lg',
  metadata: {
    nestable: true
  }
}
