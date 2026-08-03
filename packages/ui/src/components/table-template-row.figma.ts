// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=7952-14854
// source=packages/ui/src/components/table.tsx
// component=Table.Row

import figma from 'figma'

const instance = figma.selectedInstance

const selected = instance.getEnum('state', { selected: true, default: false, hover: false })

export default {
  example: figma.code`
    <Table.Row${selected ? ' selected' : ''}>
      <Table.Cell>Content</Table.Cell>
      <Table.Cell>Content</Table.Cell>
      <Table.Cell>Content</Table.Cell>
    </Table.Row>
  `,
  imports: ['import { Table } from "@harnessio/ui/components"'],
  id: 'table-template-row',
  metadata: {
    nestable: true
  }
}
