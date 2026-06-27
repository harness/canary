import { type FC, useMemo } from "react";
import * as components from "@harnessio/ui/components";
import { useColumnFilter } from "@harnessio/ui/hooks";
import * as contexts from "@harnessio/ui/context";
import Example, { type ExampleProps } from "./example";

export type ComponentExampleProps = Omit<ExampleProps, "scope"> & {
  scope?: ExampleProps["scope"];
  hideCode?: boolean;
  wrapperClassName?: string;
};

const ComponentExample: FC<ComponentExampleProps> = ({
  code,
  scope,
  contentClassName,
  wrapperClassName,
  hideCode,
}) => {
  const combinedScope = useMemo<ExampleProps["scope"]>(
    () => ({ ...components, ...contexts, ...scope, useColumnFilter }),
    [scope],
  );

  return (
    <Example
      contentClassName={contentClassName}
      wrapperClassName={wrapperClassName}
      code={code}
      scope={combinedScope}
      hideCode={hideCode}
    />
  );
};

export default ComponentExample;
