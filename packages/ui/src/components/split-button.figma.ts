// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-18889
// source=packages/ui/src/components/split-button.tsx
// component=SplitButton

import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  primary: 'primary',
  outline: 'outline',
  secondary: 'secondary'
})

const theme = instance.getEnum('theme', {
  '⚫ default': 'default',
  '🟢 success': 'success',
  '🔴 danger': 'danger'
})

const loading = instance.getEnum('state', {
  default: false,
  'hover left': false,
  'hover right': false,
  'active left': false,
  'active right': false,
  loading: true,
  'disabled left': false,
  'disabled right': false,
  disabled: false
})

const disableButton = instance.getEnum('state', {
  default: false,
  'hover left': false,
  'hover right': false,
  'active left': false,
  'active right': false,
  loading: false,
  'disabled left': true,
  'disabled right': false,
  disabled: true
})

const disableDropdown = instance.getEnum('state', {
  default: false,
  'hover left': false,
  'hover right': false,
  'active left': false,
  'active right': false,
  loading: false,
  'disabled left': false,
  'disabled right': true,
  disabled: true
})

export default {
  example: figma.code`
    <SplitButton
      variant="${variant}"
      theme="${theme}"
      loading={${loading}}
      disableButton={${disableButton}}
      disableDropdown={${disableDropdown}}
      handleButtonClick={() => {}}
      handleOptionChange={() => {}}
      options={[]}
    >
      Button text
    </SplitButton>
  `,
  imports: ['import { SplitButton } from "@harnessio/ui/components"'],
  id: 'split-button',
  metadata: {
    nestable: true
  }
}
