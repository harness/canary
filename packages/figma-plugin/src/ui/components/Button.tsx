import type { ComponentChildren, JSX } from "preact";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

type Props = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children?: ComponentChildren;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "secondary",
  size = "md",
  block = false,
  class: className,
  children,
  ...rest
}: Props) {
  const classes = [
    "ds-btn",
    `ds-btn-${variant}`,
    size === "sm" ? "ds-btn-sm" : "",
    block ? "ds-btn-block" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" class={classes} {...rest}>
      {children}
    </button>
  );
}
