import type { FC } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@harnessio/ui/components";

interface PropDescription {
  name: string;
  required?: boolean;
  defaultValue?: string;
  description?: string;
}

export interface PropsTableProps {
  props: PropDescription[];
}

const PropsTable: FC<PropsTableProps> = ({ props }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Prop</TableHead>
        <TableHead>Required</TableHead>
        <TableHead>Default</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {props.map(({ name, required, defaultValue, description }) => (
        <TableRow key={name}>
          <TableCell title={description}>{name}</TableCell>
          <TableCell>{required ? "true" : "false"}</TableCell>
          <TableCell>{defaultValue}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default PropsTable;
