import { FC } from 'react'

import { Table } from '@harnessio/ui/components'

interface PropDescription {
  name: string
  required?: boolean
  defaultValue?: string
  description?: string
}

export interface PropsTableProps {
  props: PropDescription[]
}

const PropsTable: FC<PropsTableProps> = ({ props }) => (
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Prop</Table.Head>
        <Table.Head>Required</Table.Head>
        <Table.Head>Default</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.map(({ name, required, defaultValue, description }) => (
        <Table.Row key={name}>
          <Table.Cell title={description}>{name}</Table.Cell>
          <Table.Cell>{required ? 'yup' : 'nope'}</Table.Cell>
          <Table.Cell>{defaultValue}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
)

export default PropsTable
