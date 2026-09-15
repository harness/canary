// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=7962-33627
// source=packages/ui/src/components/table.tsx
// component=Table.Header

import figma from 'figma'

export default {
  example: figma.code`
    <Table.Header>
      <Table.Row>
        <Table.Head>Column</Table.Head>
        <Table.Head>Column</Table.Head>
        <Table.Head>Column</Table.Head>
      </Table.Row>
    </Table.Header>
  `,
  imports: ['import { Table } from "@harnessio/ui/components"'],
  id: 'table-template-header',
  metadata: {
    nestable: true
  }
}
