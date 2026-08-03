// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1631-484002
// source=packages/ui/src/components/table.tsx
// component=Table.Head

import figma from 'figma'

const instance = figma.selectedInstance

const text = instance.getString('text#7592:6')
const sortable = instance.getBoolean('sort#11292:15')
const hasTooltip = instance.getBoolean('hover-tooltip#7592:19')

export default {
  example: figma.code`
    <Table.Head
      ${sortable ? 'sortable' : ''}
      ${hasTooltip ? figma.code`tooltipProps={{ content: "More info" }}` : ''}
    >
      ${text}
    </Table.Head>
  `,
  imports: ['import { Table } from "@harnessio/ui/components"'],
  id: 'table-header-cell',
  metadata: {
    nestable: true
  }
}
