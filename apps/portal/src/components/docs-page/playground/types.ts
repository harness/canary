export type ControlType = "text" | "boolean" | "number" | "select" | "color";

export interface PropControl {
  name: string;
  type: ControlType;
  defaultValue?: unknown;
  options?: string[]; // only used when type === "select"
  description?: string;
  required?: boolean;
}

export interface ComponentSchema {
  componentName: string;
  props: PropControl[];
}
