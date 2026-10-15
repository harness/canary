import { type FC, useMemo } from "react";
import * as components from "@harnessio/ui/components";
import { useColumnFilter } from "@harnessio/ui/hooks";
import * as contexts from "@harnessio/ui/context";
import { FilterGroup } from "@harnessio/filters";
import { useLocation } from "react-router-dom";
import Example, { type ExampleProps } from "./example";

export type ComponentExampleProps = Omit<ExampleProps, "scope"> & {
  scope?: ExampleProps["scope"];
  hideCode?: boolean;
};

const ComponentExample: FC<ComponentExampleProps> = ({
  code,
  scope,
  contentClassName,
  hideCode,
}) => {
  const combinedScope = useMemo<ExampleProps["scope"]>(
    () => ({
      ...components,
      ...contexts,
      ...scope,
      useColumnFilter,
      FilterGroup,
      useLocation,
    }),
    [scope],
  );

  return (
    <Example
      contentClassName={contentClassName}
      code={code}
      scope={combinedScope}
      hideCode={hideCode}
    />
  );
};

export default ComponentExample;
