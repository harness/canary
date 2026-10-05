import type { FC } from "react";
import { Input, Select, Switch, TextInput } from "@harnessio/ui/components";
import type { PropControl } from "./types";

export interface ControlFieldProps {
  prop: PropControl;
  value: unknown;
  onChange: (value: unknown) => void;
}

const ControlField: FC<ControlFieldProps> = ({ prop, value, onChange }) => {
  switch (prop.type) {
    case "boolean":
      return (
        <Switch
          label={prop.name}
          caption={prop.description}
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      );

    case "number":
      return (
        <Input
          label={prop.name}
          caption={prop.description}
          optional={!prop.required}
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case "select":
      return (
        <Select
          label={prop.name}
          caption={prop.description}
          optional={!prop.required}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
          options={(prop.options ?? []).map((opt) => ({
            label: opt,
            value: opt,
          }))}
        />
      );

    case "color":
      return (
        <Input
          label={prop.name}
          caption={prop.description}
          optional={!prop.required}
          type="color"
          value={typeof value === "string" ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return (
        <TextInput
          label={prop.name}
          caption={prop.description}
          optional={!prop.required}
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export default ControlField;
