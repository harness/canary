export type ControlType = "text" | "boolean" | "number" | "select" | "color";

export interface PropControl {
  name: string;
  type: ControlType;
  defaultValue?: unknown;
  options?: string[]; // only used when type === "select"
  description?: string;
  placeholder?: string; // hint text for text inputs
  required?: boolean;
}

export interface ComponentSchema {
  componentName: string;
  props: PropControl[];
}
