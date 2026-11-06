import type { FC } from "react";
import {
  Input,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Tooltip,
} from "@harnessio/ui/components";
import type { PropControl } from "./types";

export interface ControlFieldProps {
  prop: PropControl;
  value: unknown;
  onChange: (value: unknown) => void;
}

const ControlField: FC<ControlFieldProps> = ({ prop, value, onChange }) => {
  switch (prop.type) {
    case "boolean": {
      const toggle = (
        <Switch
          label={prop.name}
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      );
      return prop.description ? (
        <Tooltip content={prop.description} side="right">
          <div>{toggle}</div>
        </Tooltip>
      ) : (
        toggle
      );
    }

    case "number":
      return (
        <NumberInput
          size="sm"
          label={prop.name}
          tooltipContent={prop.description}
          optional={!prop.required}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case "select":
      return (
        <Select
          size="sm"
          label={prop.name}
          tooltipContent={prop.description}
          optional={!prop.required}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
          options={(prop.options ?? []).map((opt) => ({
            label: opt,
            value: opt,
          }))}
        />
      );

    case "color": {
      const colorInput = (
        <Input
          size="sm"
          label={prop.name}
          optional={!prop.required}
          type="color"
          value={typeof value === "string" ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      return prop.description ? (
        <Tooltip content={prop.description} side="right">
          <div>{colorInput}</div>
        </Tooltip>
      ) : (
        colorInput
      );
    }

    default:
      return (
        <TextInput
          size="sm"
          label={prop.name}
          tooltipContent={prop.description}
          optional={!prop.required}
          type="text"
          placeholder={prop.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export default ControlField;
