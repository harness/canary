import type { FC } from "react";
import { Input, Switch } from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";
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
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    case "select":
      return (
        <div className="flex flex-col gap-cn-3xs">
          <label
            htmlFor={prop.name}
            className="text-cn-2 text-cn-size-2 font-medium"
          >
            {prop.name}
          </label>
          <select
            id={prop.name}
            className={cn(
              "bg-cn-2 border-cn-2 text-cn-1 h-9 rounded border px-cn-sm text-cn-size-2",
            )}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {prop.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "color":
      return (
        <Input
          label={prop.name}
          caption={prop.description}
          type="color"
          value={typeof value === "string" ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return (
        <Input
          label={prop.name}
          caption={prop.description}
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export default ControlField;
