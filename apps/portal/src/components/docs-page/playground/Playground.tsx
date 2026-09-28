import { type FC, useMemo, useState } from "react";
import * as components from "@harnessio/ui/components";
import { CopyButton, TooltipProvider } from "@harnessio/ui/components";
import { cn } from "@harnessio/ui/utils";
import ControlField from "./ControlField";
import type { ComponentSchema } from "./types";

export interface PlaygroundProps {
  /** Schema produced by `pnpm --filter portal schemas` (imported as JSON). */
  schema: ComponentSchema;
  /** Defaults to schema.componentName; override if it differs from the exported name. */
  componentName?: string;
  /** Props always passed to the preview but not exposed as controls (e.g. children). */
  fixedProps?: Record<string, unknown>;
  className?: string;
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function generateCode(
  componentName: string,
  values: Record<string, unknown>,
  fixedProps: Record<string, unknown>,
): string {
  const attrs = Object.entries(values)
    .filter(([, v]) => v !== undefined && v !== "" && v !== null)
    .map(([key, v]) => {
      if (typeof v === "boolean") return v ? key : `${key}={false}`;
      return `${key}=${formatValue(v)}`;
    })
    .join(" ");

  const openTag = `<${componentName}${attrs ? " " + attrs : ""}`;
  const children = fixedProps.children;
  return children !== undefined
    ? `${openTag}>${children}</${componentName}>`
    : `${openTag} />`;
}

const Playground: FC<PlaygroundProps> = ({
  schema,
  componentName = schema.componentName,
  fixedProps = {},
  className,
}) => {
  const Component = (components as Record<string, unknown>)[componentName] as
    | FC<Record<string, unknown>>
    | undefined;

  const initialValues = useMemo(() => {
    const values: Record<string, unknown> = {};
    schema.props.forEach((p) => {
      values[p.name] = p.defaultValue;
    });
    return values;
  }, [schema]);

  const [values, setValues] = useState<Record<string, unknown>>(initialValues);

  const code = useMemo(
    () => generateCode(componentName, values, fixedProps),
    [componentName, values, fixedProps],
  );

  if (!Component) {
    return (
      <p className="text-cn-danger not-content text-cn-size-2">
        Unknown component &quot;{componentName}&quot; — check it&apos;s exported
        from @harnessio/ui/components.
      </p>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-cn-1 not-content my-cn-3xl overflow-hidden rounded-cn-6 border",
          className,
        )}
      >
        <div className="grid place-items-center p-cn-3xl">
          <Component {...fixedProps} {...values} />
        </div>

        <div className="bg-cn-2 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-cn-md border-t p-cn-md">
          {schema.props.map((prop) => (
            <ControlField
              key={prop.name}
              prop={prop}
              value={values[prop.name]}
              onChange={(v) =>
                setValues((prev) => ({ ...prev, [prop.name]: v }))
              }
            />
          ))}
        </div>

        <details className="example-expand bg-cn-2 relative border-t p-cn-sm">
          <CopyButton
            buttonVariant="transparent"
            className="absolute right-cn-sm top-cn-sm"
            name={code}
          />
          <summary className="flex cursor-pointer select-none items-center gap-cn-3xs text-cn-size-2">
            Show code
          </summary>
          <pre className="font-body-code p-cn-3xs text-cn-size-2 leading-6">
            <code>{code}</code>
          </pre>
        </details>
      </div>
    </TooltipProvider>
  );
};

export default Playground;
