import { type FC, useMemo } from "react";
import * as components from "@harnessio/ui/components";
import Example, { type ExampleProps } from "./example";

export type ComponentExampleProps = Omit<ExampleProps, "scope"> & {
  scope?: ExampleProps["scope"];
};

const ComponentExample: FC<ComponentExampleProps> = ({
  code,
  scope,
  contentClassName,
}) => {
  const combinedScope = useMemo<ExampleProps["scope"]>(
    () => ({ ...components, ...scope }),
    [scope],
  );

  return (
    <Example
      contentClassName={contentClassName}
      code={code}
      scope={combinedScope}
    />
  );
};

export default ComponentExample;
