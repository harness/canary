// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1203-4492
// source=packages/ui/src/components/inputs/search-input.tsx
// component=SearchInput

import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  off: false,
  on: true
})

export default {
  example: figma.code`
    <SearchInput
      disabled={${disabled}}
      placeholder="Search"
      onChange={() => {}}
    />
  `,
  imports: ['import { SearchInput } from "@harnessio/ui/components"'],
  id: 'search-input',
  metadata: {
    nestable: true
  }
}
