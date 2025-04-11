import type { FC } from "react";

import { Table } from "@harnessio/ui/components";

interface PropDescription {
  name: string;
  required?: boolean;
  defaultValue?: string;
  description?: string;
  value?: string;
}

export interface PropsTableProps {
  props: PropDescription[];
}

const PropsTable: FC<PropsTableProps> = ({ props }) => (
  <Table.Root variant="asStackedList" className="not-content">
    <Table.Header>
      <Table.Row>
        <Table.Head className="font-black">Prop</Table.Head>
        <Table.Head className="font-black">Required</Table.Head>
        <Table.Head className="font-black">Default</Table.Head>
        <Table.Head className="font-black">Type</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.map(({ name, required, defaultValue, description, value }) => (
        <Table.Row key={name}>
          <Table.Cell title={description}>{name}</Table.Cell>
          <Table.Cell>{required ? "true" : "false"}</Table.Cell>
          <Table.Cell className="font-mono">{defaultValue}</Table.Cell>
          <Table.Cell className="font-mono">{value}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);

export default PropsTable;
